// Pixelate.js
// returns the middle value of an image (can make more accurate to true average later)
function get_avg_value(x, y, cell_size)
{
  let idx = get_idx_from_pixels(x, y);
  
  let redness = pixels[idx];
  let greenness = pixels[idx + 1];
  let blueness = pixels[idx + 2];

  let value_mag = ((redness**2 + greenness**2 + blueness**2) / 3)**(1/2);
  return value_mag;
}

// updates pixel array to display b&w pixelated version of the image
function display_pixelated_img(pixelated_value_array)
{
  let cells_per_row = W / CELL_SIZE;

  for (let i = 0; i < pixels.length; i += 4)
  {
    let pixel_x = (i / 4) % W;
    let pixel_y = Math.floor((i / 4) / W);

    let cell_col = Math.floor(pixel_x / CELL_SIZE);
    let cell_row = Math.floor(pixel_y / CELL_SIZE);
    let v = pixelated_value_array[cell_col * cells_per_row + cell_row];

    pixels[i] = v;
    pixels[i + 1] = v;
    pixels[i + 2] = v;
    pixels[i + 3] = 255;
  }

}

function get_idx_from_pixels(x, y)
{
  return (y * W + x) * 4;
}
