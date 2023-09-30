import { Path } from 'opentype.js';

export interface ArrowConfig {
    arrowLength: number;
    arrowAperture: number;
}
function drawArrow(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    { arrowAperture, arrowLength }: ArrowConfig
) {
    const dx = x2 - x1,
        dy = y2 - y1,
        segmentLength = Math.sqrt(dx * dx + dy * dy),
        unitx = dx / segmentLength,
        unity = dy / segmentLength,
        basex = x2 - arrowLength * unitx,
        basey = y2 - arrowLength * unity,
        normalx = arrowAperture * unity,
        normaly = -arrowAperture * unitx;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(basex + normalx, basey + normaly);
    ctx.lineTo(basex - normalx, basey - normaly);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();
}
/**
 * This function is Path.prototype.draw with an arrow
 * at the end of each contour.
 */
export function drawPathWithArrows(ctx: CanvasRenderingContext2D, path: Path, config: ArrowConfig) {
    var i, cmd, x1, y1, x2, y2;
    var arrows: [CanvasRenderingContext2D, number, number, number, number][] = [];
    ctx.beginPath();
    for (i = 0; i < path.commands.length; i += 1) {
        cmd = path.commands[i];
        if (cmd.type === 'M') {
            if (x1 !== undefined) {
                arrows.push([ctx, x1, y1, x2, y2]);
            }
            ctx.moveTo(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            ctx.lineTo(cmd.x, cmd.y);
            x1 = x2;
            y1 = y2;
        } else if (cmd.type === 'C') {
            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
            x1 = cmd.x2;
            y1 = cmd.y2;
        } else if (cmd.type === 'Q') {
            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
            x1 = cmd.x1;
            y1 = cmd.y1;
        } else if (cmd.type === 'Z') {
            arrows.push([ctx, x1, y1, x2, y2]);
            ctx.closePath();
        }
        /** @ts-ignore */
        x2 = cmd.x;
        /** @ts-ignore */
        y2 = cmd.y;
    }
    if (path.fill) {
        ctx.fillStyle = path.fill;
        ctx.fill();
    }
    if (path.stroke) {
        ctx.strokeStyle = path.stroke;
        ctx.lineWidth = path.strokeWidth;
        ctx.stroke();
    }
    ctx.fillStyle = '#000000';
    arrows.forEach(function (arrow) {
        drawArrow(...arrow, config);
    });
}
