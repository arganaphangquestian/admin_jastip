import React from "react";
import { getUser } from "~/utils/session.server";
import { redirect, useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import {
  Transfer,
  User,
  Bank,
  BankAccount,
  Withdraw,
  TransferStatus,
  Balance,
  BalanceType,
} from "@prisma/client";
import { db } from "~/utils/db.server";
import axios from "axios";
import Header from "~/components/Header";
import dayjs from "dayjs";

export const meta: MetaFunction = () => {
  return {
    title: "Homepage",
    description: "Welcome to Admin Jastip!",
  };
};

type LoaderData = {
  user: User | null;
  withdraws: (Withdraw & {
    transfer: Transfer & {
      transfer_status: TransferStatus;
      bank_account: BankAccount & {
        bank: Bank;
      };
    };
    balance: Balance & {
      balance_type: BalanceType;
    };
    user: User;
  })[];
};

export const loader: LoaderFunction = async ({ request }) => {
  let user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  const withdraws = await db.withdraw.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: {
      transfer: {
        include: {
          bank_account: {
            include: {
              bank: true,
            },
          },
          transfer_status: true,
        },
      },
      balance: {
        include: {
          balance_type: true,
        },
      },
      user: true,
    },
  });
  const data: LoaderData = { user, withdraws };
  return data;
};

const Index: React.FC = () => {
  let data = useLoaderData<LoaderData>();

  const onValidateHandler = (withdraw_id: number, type: string) => {
    axios
      .post(`https://jastip.arganaphang.dev/withdraw/${withdraw_id}/validate`, {
        type: type,
      })
      .then((data) => {
        // console.log(data);
        return redirect("/withdraw");
      })
      .catch((e) => console.log(`${type} Error: ${e}`));
  };
  return (
    <div className="w-full min-h-screen flex flex-col px-4 md:px-8 py-8">
      <Header />
      <table>
        <thead>
          <tr className="flex mb-4 bg-gray-700 px-6 py-4 rounded">
            <th className="mr-4">No</th>
            <th className="mr-4 flex-1">User</th>
            <th className="mr-4 flex-1">Amount</th>
            <th className="mr-4 flex-1">Date</th>
            <th className="mr-4 flex-1">Status</th>
            <th className="mr-4 flex-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.withdraws?.map((item, key) => {
            return (
              <tr
                key={key}
                className="flex bg-gray-700 px-6 py-4 rounded items-start mb-4"
              >
                <td className="mr-4 w-6 h-6 rounded-full p-2 bg-gray-900 flex justify-center items-center text-xs">
                  {item.id}
                </td>
                <td className="mr-4 flex-1 text-left">
                  {item.user.name}
                  <details>
                    <ul className="text-left">
                      <li className="px-2 py-1 rounded-md bg-gray-500 mb-2">
                        Bank: {item.transfer.bank_account.bank.name}
                      </li>
                      <li className="px-2 py-1 rounded-md bg-gray-500 mb-2">
                        Nomor Bank: {item.transfer.bank_account.account_number}
                      </li>
                      <li className="px-2 py-1 rounded-md bg-gray-500">
                        Nama Pemilik: {item.transfer.bank_account.account_name}
                      </li>
                    </ul>
                  </details>
                </td>
                <td className="mr-4 flex-1 text-center">
                  {item.transfer.amount}
                </td>
                <td className="mr-4 flex-1 text-center">
                  {dayjs(item.created_at).format("DD-MMM-YYYY (hh:mm)")}
                </td>
                <td className="mr-4 flex-1 text-center">
                  {item.transfer.transfer_status.id === "PENDING"
                    ? "Menunggu diproses"
                    : item.transfer.transfer_status.id === "VERIFIED"
                    ? "Penarikan dana terverifikasi"
                    : item.transfer.transfer_status.id === "REJECTED"
                    ? "Penarikan dana ditolak"
                    : item.transfer.transfer_status.name}
                </td>
                <td className="flex-1 text-center">
                  <button
                    onClick={() => onValidateHandler(item.id, "VERIFIED")}
                    className={
                      "sm:mr-2 mb-2 sm:mb-0 px-4 py-1 rounded-md " +
                      `${
                        item.transfer.transfer_status.id === "PROCESSING" ||
                        item.transfer.transfer_status.id === "PENDING"
                          ? "text-green-100 bg-green-400"
                          : "text-gray-600 cursor-not-allowed"
                      }`
                    }
                    disabled={
                      item.transfer.transfer_status.id !== "PROCESSING" &&
                      item.transfer.transfer_status.id !== "PENDING"
                        ? true
                        : false
                    }
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onValidateHandler(item.id, "REJECTED")}
                    className={
                      "px-4 py-1 rounded-md  " +
                      `${
                        item.transfer.transfer_status.id === "PROCESSING" ||
                        item.transfer.transfer_status.id === "PENDING"
                          ? "text-red-100 bg-red-400"
                          : "text-gray-600 cursor-not-allowed"
                      }`
                    }
                    disabled={
                      item.transfer.transfer_status.id !== "PROCESSING" &&
                      item.transfer.transfer_status.id !== "PENDING"
                        ? true
                        : false
                    }
                  >
                    Reject
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
