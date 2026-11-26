/**
 * A Nova Poshta city: its display name and the Ref branches are looked up by.
 */
export type NovaPoshtaCity = {
  Description: string;
  Ref: string;
};

/* A Nova Poshta branch or parcel locker of one city. */
export type NovaPoshtaWarehouse = {
  Description: string;
  Ref: string;
  CategoryOfWarehouse: string;
};
