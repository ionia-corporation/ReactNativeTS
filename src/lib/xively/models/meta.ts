export interface Meta {
    /**
     * Number of items total
     */
    'count'?: number;

    /**
     * Current page
     */
    'page': number;

    /**
     * Number of items per page
     */
    'pageSize': number;

    /**
     * Sort by field
     */
    'sortBy'?: string;

    /**
     * Sort direction
     */
    'sortOrder'?: string;
}
