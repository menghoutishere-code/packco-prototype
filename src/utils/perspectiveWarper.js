/**
 * Warps a source image (texture) onto a 4-point quadrilateral on a target canvas context.
 * Uses bilinear interpolation to divide the quad into a grid, then maps each grid cell
 * using two affine-transformed triangles.
 * 
 * @param {CanvasRenderingContext2D} ctx - The destination canvas 2D context.
 * @param {HTMLImageElement|HTMLCanvasElement} img - The source texture.
 * @param {Array<{x: number, y: number}>} dstCorners - [top-left, top-right, bottom-right, bottom-left]
 * @param {number} gridCols - Horizontal grid resolution (higher is smoother, default 16).
 * @param {number} gridRows - Vertical grid resolution (higher is smoother, default 16).
 */
export function warpImage(ctx, img, dstCorners, gridCols = 16, gridRows = 16) {
  if (dstCorners.length < 4) return;
  const [p0, p1, p2, p3] = dstCorners;
  const w = img.width;
  const h = img.height;

  // Bilinearly interpolate point at (u, v) in quad space
  const getPoint = (u, v) => {
    const x = (1 - u) * (1 - v) * p0.x + u * (1 - v) * p1.x + u * v * p2.x + (1 - u) * v * p3.x;
    const y = (1 - u) * (1 - v) * p0.y + u * (1 - v) * p1.y + u * v * p2.y + (1 - u) * v * p3.y;
    return { x, y };
  };

  for (let r = 0; r < gridRows; r++) {
    const v0 = r / gridRows;
    const v1 = (r + 1) / gridRows;
    
    for (let c = 0; c < gridCols; c++) {
      const u0 = c / gridCols;
      const u1 = (c + 1) / gridCols;

      // Source texture coordinates
      const su0 = u0 * w;
      const su1 = u1 * w;
      const sv0 = v0 * h;
      const sv1 = v1 * h;

      // Destination coordinates
      const d0 = getPoint(u0, v0);
      const d1 = getPoint(u1, v0);
      const d2 = getPoint(u1, v1);
      const d3 = getPoint(u0, v1);

      // Triangle 1: d0, d1, d3
      drawTriangle(ctx, img, 
        su0, sv0, su1, sv0, su0, sv1,
        d0.x, d0.y, d1.x, d1.y, d3.x, d3.y
      );

      // Triangle 2: d1, d2, d3
      drawTriangle(ctx, img,
        su1, sv0, su1, sv1, su0, sv1,
        d1.x, d1.y, d2.x, d2.y, d3.x, d3.y
      );
    }
  }
}

function drawTriangle(ctx, img, sx0, sy0, sx1, sy1, sx2, sy2, dx0, dy0, dx1, dy1, dx2, dy2) {
  ctx.save();
  
  // Clip to the triangle to prevent visible seams between cells
  ctx.beginPath();
  ctx.moveTo(dx0, dy0);
  ctx.lineTo(dx1, dy1);
  ctx.lineTo(dx2, dy2);
  ctx.closePath();
  ctx.clip();

  // Compute affine transform matrix mapping (sx, sy) -> (dx, dy)
  const den = sx0 * (sy1 - sy2) - sy0 * (sx1 - sx2) + sx1 * sy2 - sx2 * sy1;
  if (Math.abs(den) < 1e-6) {
    ctx.restore();
    return;
  }

  const a = (dx0 * (sy1 - sy2) - sy0 * (dx1 - dx2) + dx1 * sy2 - dx2 * sy1) / den;
  const c = (sx0 * (dx1 - dx2) - dx0 * (sx1 - sx2) + sx2 * dx1 - sx1 * dx2) / den;
  const e = (sx0 * (sy1 * dx0 - sy0 * dx1) + dx0 * (sx1 * sy0 - sx0 * sy1) + sx0 * (sy0 * dx2 - sy2 * dx0)) / den; // simplified offset helper
  // Wait, let's verify direct linear equation coefficients:
  // dx = a * sx + c * sy + e
  // We can solve it directly for e:
  const e_direct = dx0 - a * sx0 - c * sy0;

  const b = (dy0 * (sy1 - sy2) - sy0 * (dy1 - dy2) + dy1 * sy2 - dy2 * sy1) / den;
  const d = (sx0 * (dy1 - dy2) - dy0 * (sx1 - sx2) + sx2 * dy1 - sx1 * dy2) / den;
  const f_direct = dy0 - b * sx0 - d * sy0;

  ctx.transform(a, b, c, d, e_direct, f_direct);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}
