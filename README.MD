Rules
Conway's Game of Life environment consists of a matrix of cells. Cell can be in an active state or in inactive state. Every iteration (game loop step) is checking how many active neighbours particular cell has, and based on the number of neighbours it either activates or deactives itself. The rules are:

- Any live cell with less than 2 live neighbours dies, as if caused by underpopulation.
- Any live cell with more than 3 live neighbours dies, as if by overcrowding.
- Any live cell with 2 or 3 live neighbours lives on to the next generation.
- Any dead cell with exactly 3 live neighbours becomes a live cell.

These rules were taken from a nice website which had the implementation which I want to avoid looking at.