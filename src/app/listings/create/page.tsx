import { ListingCreateForm } from '@/components/listing-create-form';

export default function CreateListingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Create New Listing</h1>
        <p className="text-muted-foreground">List your product, service, or property across the global VaultCommerce marketplace.</p>
      </div>

      <div className="bg-card border rounded-2xl p-6 md:p-10 shadow-sm">
        <ListingCreateForm />
      </div>
    </div>
  );
}