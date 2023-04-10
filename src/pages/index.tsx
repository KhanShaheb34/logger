import { prisma } from "@/server/db";
import { type Log } from "@prisma/client";
import { useState } from "react";

const BeautifiedJsonOrText = ({ text }: { text?: string }) => {
  let jsonData = null;
  let isJson = false;

  try {
    jsonData = JSON.parse(text || "") as Record<string, unknown>;
    isJson = true;
  } catch (error) {
    isJson = false;
  }

  return (
    <div>
      {isJson ? <pre>{JSON.stringify(jsonData, null, 2)}</pre> : <p>{text}</p>}
    </div>
  );
};

const Home = ({
  logs,
}: {
  logs: (Omit<Log, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  })[];
}) => {
  const [selectedLog, setSelectedLog] = useState(logs[0]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredLogs = logs.filter(
    (log) =>
      log.message.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.tag?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.originatedFrom.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <main className="flex w-full ">
      <div className="flex w-1/2  grow flex-col gap-5 p-5">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-md border border-gray-300 p-2"
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <table className="w-full">
          <thead className="bg p-6">
            <tr className="border-b border-gray-500">
              <th className="py-2">CreatedAt</th>
              <th className="py-2">Message</th>
              <th className="py-2">Originated From</th>
              <th className="py-2">Tag</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="cursor-pointer whitespace-nowrap border-b border-gray-200 hover:bg-slate-100"
              >
                <td className="py-2">{log.createdAt}</td>
                <td className="py-2">
                  {log.message.slice(0, 30).replace("\n", " ") + "..."}
                </td>
                <td className="py-2">
                  {log.originatedFrom.slice(0, 30) + "..."}
                </td>
                <td className="py-2">{log.tag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-screen w-1/2 grow overflow-auto bg-gray-100 p-3">
        <BeautifiedJsonOrText text={selectedLog?.message} />
      </div>
    </main>
  );
};

export const getStaticProps = async () => {
  const data = await prisma.log.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const logs = data.map((log) => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
    updatedAt: log.updatedAt.toISOString(),
  }));

  return {
    props: {
      logs,
    },
  };
};

export default Home;
