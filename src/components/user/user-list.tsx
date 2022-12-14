import Pagination from '@components/ui/pagination';
import Image from 'next/image';
import { Table } from '@components/ui/table';
import ActionButtons from '@components/common/action-buttons';
import { siteSettings } from '@settings/site.settings';
import { IPaginator, User, UserPaginator } from '@ts-types/generated';
import { useMeQuery } from '@data/user/use-me.query';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@utils/locals';

type IProps = {
  customers: IPaginator<User> | null | undefined;
  onPagination: (current: number) => void;
};
const CustomerList = ({ customers, onPagination }: IProps) => {
  const { data, paginatorInfo } = customers!;
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
  const { data: me } = useMeQuery();

  const columns = [
    {
      title: t('table:table-item-avatar'),
      dataIndex: 'profile',
      key: 'profile',
      align: 'center',
      width: 74,
      render: (profile: any, record: any) => (
        <Image
          src={profile?.avatar ?? siteSettings.avatar.placeholder}
          alt={record?.name}
          layout="fixed"
          width={42}
          height={42}
          className="rounded overflow-hidden"
        />
      ),
    },
    {
      title: t('table:table-item-title'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
    },
    {
      title: t('table:table-item-email'),
      dataIndex: 'email',
      key: 'email',
      align: alignLeft,
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      render: (is_active: boolean) => (is_active ? 'Active' : 'Inactive'),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: '_id',
      key: 'actions',
      align: 'center',
      render: (id: string, { is_active }: any) => {
        return (
          <>
            <ActionButtons id={id} userStatus={true} isUserActive={is_active} />
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        {/* @ts-ignore */}
        <Table
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={data}
          rowKey="id"
          scroll={{ x: 800 }}
        />
      </div>

      {!!paginatorInfo.totalPages && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.totalPages}
            current={paginatorInfo.pagingCounter}
            pageSize={paginatorInfo.limit}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default CustomerList;
