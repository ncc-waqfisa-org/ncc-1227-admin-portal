import React, { useEffect, useState } from "react";
import { PageComponent } from "../../components/page-component";
import PrimaryButton from "../../components/primary-button";
import SearchBarComponent from "../../components/search-bar-component";
import SecondaryButton from "../../components/secondary-button";
import UsersCardInfo from "../../components/users-card-info";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/router";
import { Admin } from "../../src/API";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/use-auth";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "users",
        "pageTitles",
        "signIn",
        "errors",
        "common",
      ])),
    },
  };
};

const Users = () => {
  const { admins } = useAppContext();
  const { t } = useTranslation("users");
  const { t: tErrors } = useTranslation("errors");
  const { push } = useRouter();
  const { isSuperAdmin } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [resultList, setResultList] = useState<Admin[]>([]);

  useEffect(() => {
    let temp = admins;
    setResultList(temp);
    setAdminList(temp);
    return () => {};
  }, [admins]);

  function resetList() {
    setResultList(adminList);
  }

  //search for admin user
  function search() {
    let searchResult = adminList?.filter(
      (value) =>
        value?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        value?.cpr?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setResultList(searchResult);
  }

  return (
    <PageComponent title={"Users"}>
      {!isSuperAdmin && (
        <div>
          <p className="p-8 text-xl font-bold text-center text-error">
            {tErrors("accessDenied")}
          </p>
        </div>
      )}
      {isSuperAdmin && (
        <div className="">
          <div className="mb-4 ">
            <div className="mb-6 ">
              <div className="text-2xl font-semibold ">{t("adminTitle")}</div>
            </div>

            {/* administrators search bar */}
            <div className="flex justify-between gap-4 p-6 border rounded-xl border-nccGray-50 bg-nccGray-50">
              <div className="w-full ">
                <SearchBarComponent
                  searchChange={(value) => {
                    setSearchValue(value);

                    if (value === "") {
                      resetList();
                    }
                  }}
                  onSubmit={(value: string) => {
                    setSearchValue(value);
                    search();
                  }}
                />
              </div>
              <div className="flex gap-4 ">
                <PrimaryButton
                  name={t("search")}
                  buttonClick={search}
                ></PrimaryButton>
                {isSuperAdmin && (
                  <SecondaryButton
                    name={t("addUser")}
                    buttonClick={() => push("/users/addUsers")}
                  ></SecondaryButton>
                )}
              </div>
            </div>
          </div>

          {/* grid table of users*/}
          {resultList?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-y-4 gap-x-3">
              {resultList?.map((admin) => (
                <UsersCardInfo
                  key={admin?.cpr}
                  fullName={`${admin?.fullName}`}
                  userName={`${admin?.cpr}`}
                  role={admin?.role}
                ></UsersCardInfo>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 border border-nccGray-100 rounded-xl bg-nccGray-100">
              <div className="text-base font-medium ">
                Sorry! There are no admins at the moment.
              </div>
            </div>
          )}
        </div>
      )}
    </PageComponent>
  );
};

export default Users;
