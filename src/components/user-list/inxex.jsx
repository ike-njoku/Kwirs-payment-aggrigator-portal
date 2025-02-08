import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import UsersTable from "../users";
import SearchBar from "../users/SearchBar";
import DropdownFilter from "../users/DropdownFilter";

const UserListPage = () => {
  return (
    <DashboardLayout page="Users">
      <section className="w-full">
        <div className=" w-[90%] mx-auto py-5">
          <div className=" w-full lg:mt-10">
            {/* search bar and filter options here */}
            <section className="w-full mb-3 flex justify-between items-center gap-5">
              <DropdownFilter />
              <SearchBar />
            </section>
            {/* table */}
            <UsersTable />
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default UserListPage;
