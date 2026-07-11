/**
 * Generic read-model helpers shared across domain list queries. Not wired
 * to any data-fetching implementation - purely a shape contract for future
 * application-layer code.
 */
export interface Page<T> {
  items: T[];
  total: number;
  pageSize: number;
  pageNumber: number;
}

export interface PageRequest {
  pageSize: number;
  pageNumber: number;
}
