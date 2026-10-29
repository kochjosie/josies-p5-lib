// Voxelize.js

function voxelize()
{
  let bounding_box = get_bounding_box();  // bounding box is an array of cubes

  // RANDOM SAMPLING: WORKS BETTER ON LOWER VERTICES OR HIGHER VOXELS
  const first = bounding_box[0][0][0];
  const samples = 5;
  
  for (let i = 0; i < my_object.faces.length; i++)
  {
    let face = my_object.faces[i];
    let a = my_object.vertices[face[0]];
    let b = my_object.vertices[face[1]];
    let c = my_object.vertices[face[2]];

    for (let j = 0; j < samples; j++)
    {
      let x = get_random_tri_coord(a.x, b.x, c.x);
      let y = get_random_tri_coord(a.y, b.y, c.y);
      let z = get_random_tri_coord(a.z, b.z, c.z);

      let grid_i = min(floor((x - first.starting_x) / first.cell_size), bounding_box.length - 1);
      let grid_j = min(floor((y - first.starting_y) / first.cell_size), bounding_box[0].length - 1);
      let grid_k = min(floor((z - first.starting_z) / first.cell_size), bounding_box[0][0].length - 1);

      bounding_box[grid_i][grid_j][grid_k].filled = true;
    }
  }
  /* WORKS BETTER ON HIGHER VERTICES OR LOWER VOXELS
  const first = bounding_box[0][0][0];
  // for every vertex of object
  for (let i = 0; i < my_object.vertices.length; i += 3)
  {
    const v = my_object.vertices[i];
    
    // solve which grid index its in
    let grid_i = floor((v.x - first.starting_x) / first.cell_size);
    let grid_j = floor((v.y - first.starting_y) / first.cell_size);
    let grid_k = floor((v.z - first.starting_z) / first.cell_size);

    grid_i = min(grid_i, bounding_box.length - 1);
    grid_j = min(grid_j, bounding_box[0].length - 1);
    grid_k = min(grid_k, bounding_box[0][0].length - 1);

    bounding_box[grid_i][grid_j][grid_k].filled = true;
  }
  */
  return bounding_box;
}

function get_bounding_box()
{
  // make sure model is global so that you can access the array of its vertices
  // like pixels, it is a 1D array

  let min_x = 1000000000000;
  let max_x = -1000000000000;
  let min_y = 1000000000000;
  let max_y = -1000000000000;
  let min_z = 1000000000000;
  let max_z = -1000000000000;
  
  for (let i = 0; i < my_object.vertices.length; i++)
  {
    if (my_object.vertices[i].x < min_x)
    {
      min_x = my_object.vertices[i].x;
    }
    if (my_object.vertices[i].x > max_x)
    {
      max_x = my_object.vertices[i].x;
    }

    if (my_object.vertices[i].y < min_y)
    {
      min_y = my_object.vertices[i].y;
    }
    if (my_object.vertices[i].y > max_y)
    {
      max_y = my_object.vertices[i].y;
    }

    if (my_object.vertices[i].z < min_z)
    {
      min_z = my_object.vertices[i].z;
    }
    if (my_object.vertices[i].z > max_z)
    {
      max_z = my_object.vertices[i].z;
    }
  }

  let voxel_size = max(width, height, DEPTH) / VOXELS;

  let bounding_box = generate_3d_grid(
    max_x - min_x,
    max_y - min_y,
    max_z - min_z,
    voxel_size, min_x, min_y, min_z
  );

  return bounding_box;
}

function get_random_tri_coord(a, b, c)
{
  let random_pt = 0;
  let r1 = random(0, 1);
  let r2 = random(0, 1);

  if (r1 + r2 > 1)
  {
    r1 = 1 - r1;
    r2 = 1 - r2;
  }

  random_pt = a + r1 * (b - a) + r2 * (c - a);
  return random_pt;
}
