import {
  QueryParamsType,
  CategoriesQueryOptionsType,
} from '@ts-types/custom.types';
import { mapPaginatorData, stringifySearchQuery } from '@utils/data-mappers';
import { useQuery } from 'react-query';
import Category from '@repositories/category';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { CategoryPaginator } from '@ts-types/generated';

const fetchCategoriesAll = async ({
  queryKey,
}: QueryParamsType): Promise<{ categories: CategoryPaginator }> => {
  const [_key, params] = queryKey;

  const {
    page,
    text,
    type,
    limit = 15,
    orderBy = 'updatedAt',
    sortedBy = 'DESC',
  } = params as CategoriesQueryOptionsType;

  const url = `${API_ENDPOINTS.ALL_CATEGORIES}?${
    text ? `search=${text}&` : ''
  }${type ? `type=${type}&` : ''}searchJoin=and&limit=${limit}&${
    page ? `page=${page}` : ''
  }&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const {
    data: { docs, ...rest },
  } = await Category.all(url);
  return {
    categories: {
      data: docs,
      paginatorInfo: mapPaginatorData({ ...rest }),
    },
  };
};

const useCategoriesAllQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ categories: CategoryPaginator }, Error>(
    [API_ENDPOINTS.CATEGORIES, options],
    fetchCategoriesAll,
    {
      keepPreviousData: true,
    }
  );
};

export { useCategoriesAllQuery, fetchCategoriesAll };