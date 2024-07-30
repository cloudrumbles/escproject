import React, { useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Hotel } from '../types';
import HotelCard from './HotelCard';

interface VirtualizedHotelListProps {
  hotels: Hotel[];
  isLoading: boolean;
  error: Error | null;
  onLoadMore: () => void;
  onSelectHotel: (hotelId: string) => void;
}

const VirtualizedHotelList: React.FC<VirtualizedHotelListProps> = ({
  hotels,
  isLoading,
  error,
  onLoadMore,
  onSelectHotel,
}) => {
  const itemCount = hotels.length + 1; // +1 for loading indicator
  const loadMoreItems = useCallback(() => {
    if (!isLoading) {
      onLoadMore();
    }
  }, [isLoading, onLoadMore]);

  const isItemLoaded = useCallback((index: number) => index < hotels.length, [hotels.length]);

  const rowRenderer = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      if (!isItemLoaded(index)) {
        return (
          <div style={style} className="flex items-center justify-center">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        );
      }
      const hotel = hotels[index];
      return (
        <div style={style}>
          <HotelCard hotel={hotel} onSelect={onSelectHotel} />
        </div>
      );
    },
    [hotels, isItemLoaded, onSelectHotel]
  );

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={600}
          itemCount={itemCount}
          itemSize={200}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width="100%"
        >
          {rowRenderer}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default VirtualizedHotelList;