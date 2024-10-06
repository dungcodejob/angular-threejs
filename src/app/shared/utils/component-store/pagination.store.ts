import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";

interface PaginationState {
  pageSize: number;
  currentPage: number;
  totalCount: number;
}

const initialState: PaginationState = {
  pageSize: 10,
  currentPage: 1,
  totalCount: 0,
};

@Injectable({ providedIn: "root" })
export class PaginationStore extends ComponentStore<PaginationState> {
  readonly pageSize$ = this.select(state => state.pageSize);
  readonly currentPage$ = this.select(state => state.currentPage);
  readonly totalCount$ = this.select(state => state.totalCount);

  constructor() {
    super(initialState);
  }

  readonly setPageSize = this.updater((state, pageSize: number) => ({
    ...state,
    pageSize,
  }));

  readonly setCurrentPage = this.updater((state, currentPage: number) => ({
    ...state,
    currentPage,
  }));
}
