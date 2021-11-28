import React from "react";
import { getUser } from "~/utils/session.server";
import { redirect, useLoaderData, Link } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import {
  Jastip,
  Transaction,
  TransactionStatus,
  TransactionTransfer,
  Transfer,
  User,
  Bank,
  BankAccount,
  Province,
} from "@prisma/client";
import { db } from "~/utils/db.server";
import axios from "axios";
import Header from "~/components/Header";

export const meta: MetaFunction = () => {
  return {
    title: "Homepage",
    description: "Welcome to Admin Jastip!",
  };
};

type LoaderData = {
  user: User | null;
  transactions: (TransactionTransfer & {
    transaction: Transaction & {
      transaction_status: TransactionStatus;
      jastip: Jastip & {
        province: Province;
        user: User;
      };
    };
    transfer: Transfer & {
      bank_account: BankAccount & {
        bank: Bank;
      };
      transfer_status: TransactionStatus;
    };
  })[];
};

export const loader: LoaderFunction = async ({ request }) => {
  let user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  const transactions = await db.transactionTransfer.findMany({
    orderBy: {
      transfer: {
        updated_at: "desc",
      },
    },
    include: {
      transaction: {
        include: {
          transaction_status: true,
          jastip: {
            include: {
              province: true,
              user: true,
            },
          },
        },
      },
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
    },
  });
  const data: LoaderData = { user, transactions };
  return data;
};

const Index: React.FC = () => {
  let data = useLoaderData<LoaderData>();

  const onValidateHandler = (
    transaction_id: number,
    transfer_id: number,
    type: string
  ) => {
    axios
      .post(
        `https://jastip.arganaphang.dev/transaction/${transaction_id}/validate-transfer/${transfer_id}`,
        {
          type: type,
        }
      )
      .then((data) => {
        // console.log(data);
        return redirect("/transfer");
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
            <th className="mr-4 flex-1">Jastip Title</th>
            <th className="mr-4 flex-1">Amount</th>
            <th className="mr-4 flex-1">Transfer Type</th>
            <th className="mr-4 flex-1">Attachment</th>
            <th className="mr-4 flex-1">Status</th>
            <th className="mr-4 flex-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.transactions?.map((item, key) => {
            return (
              <tr
                key={key}
                className="flex bg-gray-700 px-6 py-4 rounded items-start mb-4"
              >
                <td className="mr-4 w-6 h-6 rounded-full p-2 bg-gray-900 flex justify-center items-center text-xs">
                  {item.id}
                </td>
                <td className="mr-4 flex-1 text-left">
                  {item.transaction.jastip.user.name}
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
                  {item.transaction.jastip.title}
                </td>
                <td className="mr-4 flex-1 text-center">
                  {item.transfer.amount}
                </td>
                <td className="mr-4 flex-1 text-center">
                  Pembayaran{" "}
                  {item.type === "TRANSACTION_PAYMENT" ? "Jastip" : "Ekspedisi"}
                </td>
                <td className="mr-4 flex-1 text-center">
                  <a
                    href={`${item.transfer.attachment_url}`}
                    target="_blank"
                    className="underline"
                  >
                    Detail
                  </a>
                </td>
                <td className="flex-1 text-center">
                  {item.transfer.transfer_status.name}
                </td>
                <td className="flex-1 text-center">
                  <button
                    onClick={() =>
                      onValidateHandler(
                        item.transaction_id,
                        item.transfer_id,
                        "VERIFIED"
                      )
                    }
                    className={
                      "sm:mr-2 mb-2 sm:mb-0 px-4 py-1 rounded-md " +
                      `${
                        item.transfer.transfer_status.id === "PROCESSING"
                          ? "text-green-100 bg-green-400"
                          : "text-gray-600 cursor-not-allowed"
                      }`
                    }
                    disabled={
                      item.transfer.transfer_status.id !== "PROCESSING"
                        ? true
                        : false
                    }
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      onValidateHandler(
                        item.transaction_id,
                        item.transfer_id,
                        "REJECTED"
                      )
                    }
                    className={
                      "px-4 py-1 rounded-md  " +
                      `${
                        item.transfer.transfer_status.id === "PROCESSING"
                          ? "text-red-100 bg-red-400"
                          : "text-gray-600 cursor-not-allowed"
                      }`
                    }
                    disabled={
                      item.transfer.transfer_status.id !== "PROCESSING"
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
