// components/listings/ListingFormHeader.tsx
export const ListingFormHeader = ({ title }: { title: string }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>Dashboard</li>
          <li>My Listings</li>
          <li>{title}</li>
        </ul>
      </div>
    </div>
  );
};