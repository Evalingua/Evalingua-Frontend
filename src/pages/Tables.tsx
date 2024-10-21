import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import Table from '../components/Tables/Table';

const Tables = () => {
  const packageData = [
    {
      name: 'Free package',
      price: 0.0,
      invoiceDate: 'Jan 13, 2023',
      status: 'Paid',
    },
    {
      name: 'Standard Package',
      price: 59.0,
      invoiceDate: 'Jan 13, 2023',
      status: 'Paid',
    },
    {
      name: 'Business Package',
      price: 99.0,
      invoiceDate: 'Jan 13, 2023',
      status: 'Unpaid',
    },
    {
      name: 'Standard Package',
      price: 59.0,
      invoiceDate: 'Jan 13, 2023',
      status: 'Pending',
    },
  ];

  const columns = [
    { title: 'Package', key: 'name' },
    { title: 'Price', key: 'price', render: (item: any) => `$${item.price}` },
    { title: 'Invoice Date', key: 'invoiceDate' },
    {
      title: 'Status',
      key: 'status',
      render: (item: any) => (
        <span
          className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
            item.status === 'Paid'
              ? 'bg-success/10 text-success'
              : item.status === 'Unpaid'
              ? 'bg-danger/10 text-danger'
              : 'bg-warning/10 text-warning'
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'Edit', onClick: (item:any) => console.log('Edit', item) },
    { label: 'Delete', onClick: (item:any) => console.log('Delete', item) },
    { label: 'View', onClick: (item:any) => console.log('View', item) },
    { label: 'Download', onClick: (item:any) => console.log('Download', item) },
    { label: 'Evaluation', onClick: (item:any) => console.log('Evaluation', item) },
  ];


  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
        <Table columns={columns} data={packageData} actions={actions} />
      </div>
    </>
  );
};

export default Tables;
