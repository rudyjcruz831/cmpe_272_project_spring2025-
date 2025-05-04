import { NextResponse } from 'next/server';
import data from '../../data/rental_listings.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '9');

  // Optional: capture filters from query (future improvement)
  const search = (searchParams.get('search') || '').toLowerCase();
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '10000000');

  // Filter based on price and search query
  const filtered = data.filter((property: { price: string; address: string; beds: string; baths: string; }) => {
    const priceNumeric = parseInt(property.price.replace(/\D/g, '')) || 0;
    const matchesPrice = priceNumeric >= minPrice && priceNumeric <= maxPrice;

    const matchesSearch =
      search === '' ||
      property.address.toLowerCase().includes(search) ||
      property.beds.toLowerCase().includes(search) ||
      property.baths.toLowerCase().includes(search);

    return matchesPrice && matchesSearch;
  });

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filtered.slice(start, end);

  return NextResponse.json({
    properties: paginated,
    total: filtered.length
  });
}