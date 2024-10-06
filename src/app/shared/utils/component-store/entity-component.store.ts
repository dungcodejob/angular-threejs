import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import {
  Comparer,
  createEntityAdapter,
  EntityAdapter,
  EntityState,
  IdSelector,
} from "@ngrx/entity";
import {
  Dictionary,
  EntityMap,
  EntityMapOne,
  EntitySelectors,
  Predicate,
  Update,
} from "node_modules/@ngrx/entity/src/models";
import { Observable } from "rxjs";

@Injectable()
export abstract class EntityComponentStore<
  TEntity,
  ExtraState extends object = object,
> extends ComponentStore<EntityState<TEntity> & ExtraState> {
  protected readonly _adaptor: EntityAdapter<TEntity>;
  protected readonly _selectors: EntitySelectors<TEntity, EntityState<TEntity>>;

  readonly all$: Observable<TEntity[]>;
  readonly ids$: Observable<string[] | number[]>;
  readonly entities$: Observable<Dictionary<TEntity>>;
  readonly total$: Observable<number>;

  constructor(
    initialExtra: ExtraState,
    selectId?: IdSelector<TEntity>,
    sortComparer?: false | Comparer<TEntity>
  ) {
    super();
    const adaptor = createEntityAdapter<TEntity>({
      selectId,
      sortComparer,
    });
    this._adaptor = adaptor;
    this._selectors = adaptor.getSelectors();

    const initialState = this._adaptor.getInitialState(initialExtra);
    this.setState(initialState);

    this.all$ = this.select(this._selectors.selectAll);
    this.ids$ = this.select(this._selectors.selectIds);
    this.entities$ = this.select(this._selectors.selectEntities);
    this.total$ = this.select(this._selectors.selectTotal);
  }

  readonly addItem = this.updater((state, item: TEntity) =>
    this._adaptor.addOne(item, state)
  );

  readonly setItem = this.updater((state, item: TEntity) =>
    this._adaptor.setOne(item, state)
  );

  readonly upsertItem = this.updater((state, item: TEntity) =>
    this._adaptor.upsertOne(item, state)
  );

  readonly addItems = this.updater((state, items: TEntity[]) =>
    this._adaptor.addMany(items, state)
  );

  readonly upsertItems = this.updater((state, items: TEntity[]) =>
    this._adaptor.upsertMany(items, state)
  );

  readonly updateItem = this.updater((state, update: Update<TEntity>) =>
    this._adaptor.updateOne(update, state)
  );

  readonly updateItems = this.updater((state, updates: Update<TEntity>[]) =>
    this._adaptor.updateMany(updates, state)
  );

  readonly mapItem = this.updater((state, entityMap: EntityMapOne<TEntity>) =>
    this._adaptor.mapOne(entityMap, state)
  );

  readonly mapItems = this.updater((state, entityMap: EntityMap<TEntity>) =>
    this._adaptor.map(entityMap, state)
  );

  readonly deleteItem = this.updater((state, id: string) =>
    this._adaptor.removeOne(id, state)
  );

  readonly deleteItems = this.updater((state, ids: string[]) =>
    this._adaptor.removeMany(ids, state)
  );

  readonly deleteItemsByPredicate = this.updater((state, predicate: Predicate<TEntity>) =>
    this._adaptor.removeMany(predicate, state)
  );

  readonly loadItems = this.updater((state, items: TEntity[]) =>
    this._adaptor.setAll(items, state)
  );

  readonly setItems = this.updater((state, items: TEntity[]) =>
    this._adaptor.setAll(items, state)
  );

  readonly clearItems = this.updater(state => this._adaptor.removeAll(state));
}
