// Metaball.js

class Metaball
{
  constructor(x, y, r, freq)
  {
    this.xi = x;
    this.yi = y;
    this.x = x;
    this.y = y;``
    this.r = r;
    this.freq = freq;
    this.vx = 0;
    this.vy = 0;
    this.seed = random(1000);
  }

  // regular circles
  is_pixel_filled(pixel_x, pixel_y)
  {
    let d = dist(this.x, this.y, pixel_x, pixel_y)
    if (d < this.r)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  // field(x, y) = Σ  r² / ((x - xᵢ)² + (y - yᵢ)²)
  // this function is each item of the sum
  read_field_value(pixel_x, pixel_y)
  {
    let dx = pixel_x - this.x;
    let dy = pixel_y - this.y;
    let field = this.r**2 / (dx**2 + dy**2 + 0.0001);  // avoid div by zero
    return field;
  }

  move()
  {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width)
    {
      this.vx *= -1;
      //ping(this.freq);
      
    }

    if (this.y < 0 || this.y > height)
    {
      this.vy *= -1;
      //ping(this.freq);
    }
  }
}

class MetaballFamily
{
  constructor(x, y, max_distance, c)
  {
    this.x = x;
    this.y = y;
    this.max_distance = max_distance;  // how long the leash goes
    this.color = c;  // rgb array of family
    this.vx = 0;
    this.vy = 0;
    this.family_members = [];  // holds the metaball objects in the family
  }

  // methods go here...
  add_mb_to_family()
  {
    let mb_angle = random(0, 360);
    let mb_distance = random(0.1 * this.max_distance, this.max_distance);
    let mb_x = this.x + (mb_distance * cos(mb_angle));
    let mb_y = this.y + (mb_distance * sin(mb_angle));
    let mb_r = random(0.05 * width, 0.2 * width);  // maybe change this to be an input later
    let mb_freq = notes[floor(random(0, notes.length))];
    this.family_members.push(new Metaball(mb_x, mb_y, mb_r));
  }

  move_family()
  {
    // move parent
    this.x += this.vx;
    this.y += this.vy;
    
    // call mb.move()
    for (let mb of this.family_members)
    { 
      let t = frameCount * 0.01;
      let offset_x = (noise(mb.seed, t) - 0.5) * this.max_distance * 2;
      let offset_y = (noise(mb.seed + 500, t) - 0.5) * this.max_distance * 2;

      let target_x = this.x + offset_x;
      let target_y = this.y + offset_y;

      mb.vx += (target_x - mb.x) * 0.0005;
      mb.vy += (target_y - mb.y) * 0.0005;

      mb.vx *= 0.999;
      mb.vy *= 0.999;

      mb.move();
    }

    if (this.x < 0 || this.x > width)
    {
      this.vx *= -1;
    }

    if (this.y < 0 || this.y > height)
    {
      this.vy *= -1;
    }
  }

  read_family_field()
  {
    determine_pixel_vals_from_mb_field_sums(this.family_members, paper_rgb, this.color, MB_THRESHOLD, 255, 255);
  }
}

function determine_pixel_vals_from_mb_field_sums(metaballs, rgb_paper_color = [0, 0, 0], rgb_ink_color = [255, 255, 255], metaball_threshold, paper_alpha = 255, ink_alpha = 255)
{
  for (let i = 0; i < pixels.length; i += 4)
  {
    let pixel_x = (i / 4) % width;
    let pixel_y = Math.floor((i / 4) / width);

    let sum = 0;
    for (let mb of metaballs)
    {
      sum += mb.read_field_value(pixel_x, pixel_y);
    }

    if (sum >= metaball_threshold)
    {
      pixels[i] = rgb_ink_color[0];
      pixels[i+1] = rgb_ink_color[1];
      pixels[i+2] = rgb_ink_color[2];
      pixels[i+3] = ink_alpha;
    }
  } 
}

function paint_background(rgb_paper_color, paper_alpha = 255)
{
  for(let i = 0; i < pixels.length; i += 4)
  {
    pixels[i] = rgb_paper_color[0];
    pixels[i+1] = rgb_paper_color[1];
    pixels[i+2] = rgb_paper_color[2];
    pixels[i+3] = paper_alpha;
  }
}

// initiates metaball objects within a given grid, metaballs will be centered in each cell. assumes a local metaball object array given that this function is usually used for image processing. 

// if you want to move within a grid, comment out the return statement and make sure metaballs is global.
function initiate_metaballs_in_grid(grid, fill_percent, is_radius_standardized, mb_radius = 1)
{
  let metaballs = [];
  
  for (let i = 0; i < grid.length; i++)
  {
    let cell = grid[i];

    let is_filled = random(100) < fill_percent;

    if (is_filled)
    {
      if (!is_radius_standardized)
      {
        mb_radius = random(0, cell.cell_size / 1.5);
      }
      
      metaballs.push(new Metaball(cell.x + cell.cell_size / 2, cell.y + cell.cell_size / 2, mb_radius)); 
    }
  }
  return metaballs;
}

// initiates metaball objects based on a given x, y, and r

// assumes a global metaball array given that this will likely be called in draw(). if you want it to be local, just add a return metaballs statement at the bottom and pass it as a parameter.

// is this an unneccessary function?
function initiate_metaball_objects(x, y, r)
{
  metaballs.push(new Metaball(x, y, r));
}

// assumes a global metaball array called metaball_families given that this will likely be called in draw(). if you want it to be local, just add a return metaballs statement at the bottom and pass it as a parameter.
function initiate_metaball_family(x, y, max_distance, n_members, col)
{
  metaball_families.push(new MetaballFamily(x, y, max_distance, col));

  for (let i = 0; i < n_members; i++)
  {
    metaball_families[metaball_families.length - 1].add_mb_to_family();
  }
}

// assumes a global metaball_families array
function initiate_family_velocities()
{
  for (let i = 0; i < metaball_families.length; i++)
  {
    let x_polarity = floor(random(0, 2)) ? -1 : 1;
    let y_polarity = floor(random(0, 2)) ? -1 : 1;
    metaball_families[i].vx = x_polarity * random(PARENT_SPEED - 1, PARENT_SPEED + 1);
    metaball_families[i].vy = y_polarity * random(PARENT_SPEED - 1, PARENT_SPEED - 1);

    initiate_metaball_velocities(metaball_families[i].family_members);
  }
}

function initiate_metaball_velocities(metaballs)
{
  for (let i = 0; i < metaballs.length; i++)
  {
    metaballs[i].vx = random(-3 * PARENT_SPEED, 3 * PARENT_SPEED);
    metaballs[i].vy = random(-3 * PARENT_SPEED, 3 * PARENT_SPEED);
  }
}
