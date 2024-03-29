import useSWR, { SWRConfiguration } from 'swr';
import { IProduct } from '@Interfaces';

const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json());

export const useProductsStore = ( url: string, config: SWRConfiguration = {} ) => {
  const { data, error } = useSWR<IProduct[]>(`/api${ url }`, fetcher, config);

  return {
    products: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};