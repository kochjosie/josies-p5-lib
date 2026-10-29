// Grid.js

class Cell
{
  constructor(x, y, cell_size)
  {
    this.x = x;  // marks top left position of cell
    this.y = y;
    this.cell_size = cell_size;
  }
  draw(is_stroked, stroke_color = [0, 0, 0], stroke_weight = 1, is_filled = false, fill_color = [255, 255, 255])
  {
    is_filled ? fill(fill_color[0], fill_color[1], fill_color[2]) : noFill();
    is_stroked ? stroke(stroke_color[0], stroke_color[1], stroke_color[2]) : noStroke();
    strokeWeight(stroke_weight);
    square(this.x, this.y, this.cell_size);
  }
}

class Cell3D
{
  constructor(x, y, z, cell_size, 
              starting_x = 0, starting_y = 0, starting_z = 0)
  {
    this.x = x;
    this.y = y;
    this.z = z;
    this.cell_size = cell_size;
    this.starting_x = starting_x;
    this.starting_y = starting_y;
    this.starting_z = starting_z;
    this.filled = false;
  }

  draw(is_stroked, stroke_color = [0, 0, 0], stroke_weight = 1, is_filled = false, fill_color = [255, 255, 255])
  {
    is_filled ? fill(fill_color[0], fill_color[1], fill_color[2]) : noFill();
    is_stroked ? stroke(stroke_color[0], stroke_color[1], stroke_color[2]) : noStroke();
    strokeWeight(stroke_weight);

    push();
    const mid = this.cell_size / 2;
    translate(
      this.x + mid,
      this.y + mid,
      this.z + mid
    );  // required to place x, y, and z of box
    box(this.cell_size, this.cell_size, this.cell_size);
    pop();
  }
}

function generate_grid(grid_width, grid_height, cell_size, a = 0, b = 0, c = 0)
{
  let grid = [];
  
  for (let i = a; i < (grid_height / cell_size) + a; i++)
  {
    grid[i] = [];
    for (let j = b; j < (grid_width / cell_size) + b; j++)
    {
      grid[i][j] = new Cell(
        i * cell_size + a, 
        j * cell_size + b, 
        cell_size
      );
    }
  }
  return grid;
}

function generate_3d_grid(grid_width, grid_height, grid_depth, cell_size, a = 0, b = 0, c = 0)
{
  let grid = [];

  for (let i = 0; i < (grid_width / cell_size); i++)
  {
    grid[i] = [];
    for (let j = 0; j < (grid_height / cell_size); j++)
    {
      grid[i][j] = [];
      for (let k = 0; k < (grid_depth / cell_size); k++)
      {
        grid[i][j][k] = new Cell3D(
          i * cell_size + a,
          j * cell_size + b, 
          k * cell_size + c,
          cell_size, a, b, c
        );
      }
    }
  }
  return grid;
}
