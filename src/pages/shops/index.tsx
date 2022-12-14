import Card from '@components/common/card';
import Layout from '@components/layouts/admin';
import ErrorMessage from '@components/ui/error-message';
import Loader from '@components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopList from '@components/shop/shop-list';
import { useState } from 'react';
import Search from '@components/common/search';
import { adminOnly } from '@utils/auth-utils';
import { useShopsQuery } from '@data/shop/use-shops.query';
import SortForm from '@components/common/sort-form';
import { SortOrder } from '@ts-types/generated';

export default function AllShopPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('createdAt');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const {
    data,
    isLoading: loading,
    error,
  } = useShopsQuery({
    text: searchTerm,
    limit: 10,
    page,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-lg font-semibold text-heading">
            {t('common:sidebar-nav-item-shops')}
          </h1>
        </div>

        <div className="w-full md:w-3/4 flex flex-col md:flex-row items-center ms-auto">
          <Search onSearch={handleSearch} />
          <SortForm
            showLabel={false}
            className="w-full md:w-1/2 md:ms-5 mt-5 md:mt-0 flex-shrink-0"
            onSortChange={({ value }: { value: SortOrder }) => {
              setColumn(value);
            }}
            onOrderChange={({ value }: { value: string }) => {
              setOrder(value);
            }}
            options={[
              { id: 1, value: 'name', label: 'Name' },
              { id: 1, value: 'products_count', label: 'Products Count' },
              { id: 1, value: 'orders_count', label: 'Orders Count' },
              { id: 2, value: 'createdAt', label: 'Created At' },
              { id: 2, value: 'updatedAt', label: 'Updated At' },
            ]}
          />
        </div>
      </Card>
      <ShopList shops={data?.shops} onPagination={handlePagination} />
    </>
  );
}
AllShopPage.authenticate = {
  permissions: adminOnly,
};
AllShopPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
