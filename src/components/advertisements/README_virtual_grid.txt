# VirtualizedListingsGrid

This component uses react-window's FixedSizeGrid to efficiently render large product grids. Only visible items are rendered, improving performance for large datasets.

## Usage

Replace ListingsGrid with VirtualizedListingsGrid in your page/component:

```
import VirtualizedListingsGrid from './VirtualizedListingsGrid';

<VirtualizedListingsGrid
  displayedListings={displayedListings}
  handleQuickView={handleQuickView}
  searchTerm={searchTerm}
  searchScores={searchScores}
  columnCount={4} // or responsive logic
  rowHeight={320}
  columnWidth={270}
  height={900}
/>
```

## Install react-window

```
npm install react-window
```

## Customization
- Adjust columnCount, rowHeight, columnWidth, and height for your layout.
- The grid is responsive to the number of products and columns.

## Next Steps
- Update your Advertisements page to use VirtualizedListingsGrid for best performance.
- Proceed to implement skeleton loaders, image optimization, and other recommendations.
