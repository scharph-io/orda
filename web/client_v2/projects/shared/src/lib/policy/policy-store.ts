import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { PolicySyncService } from './policy-sync.service';
import { pipe, switchMap, tap } from 'rxjs';

export interface Policy {
  role: string;
  resource: string;
  action: string;
  effect: string;
}

type PolicyStoreState = {
  policies: Policy[];
  isLoading: boolean;
};

const initialState: PolicyStoreState = {
  policies: [],
  isLoading: false,
};

export const PolicyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, service = inject(PolicySyncService)) => ({
    getPolicies: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((role) =>
          service.fetchPolicies().pipe(
            tapResponse({
              next: (policies) => patchState(store, { policies }),
              error: (error) => console.log(error),
              finalize: () => patchState(store, { isLoading: false }),
            })
          )
        )
      )
    ),
  }))
);
