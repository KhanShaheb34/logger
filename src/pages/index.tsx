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

  return (
    <main className="flex w-full ">
      <div className="w-1/2 grow  p-3">
        <table className="w-full">
          <thead className="bg p-6">
            <tr>
              <th>createdAt</th>
              <th>message</th>
              <th>Originated From</th>
              <th>Tag</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="cursor-pointer"
              >
                <td>{log.createdAt}</td>
                <td>{log.message.slice(0, 30).replace("\n", " ") + "..."}</td>
                <td>{log.originatedFrom.slice(0, 30) + "..."}</td>
                <td>{log.tag}</td>
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
