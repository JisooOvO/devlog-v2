import prisma from "@/lib/prisma";
import { Post, Series, Thumbnail, Topic } from "@prisma/client";
import "@/style/manage.css";
import { Fragment } from "react";
import UpdateAndDelete from "./component/updateAndDelete";

const ManagePage = async () => {
  const [topics, series, thumbnails, posts] = await prisma.$transaction([
    prisma.topic.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.series.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.thumbnail.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.post.findMany({
      orderBy: {
        title: "asc",
      },
    }),
  ]);

  return (
    <div>
      <ManageConatiner
        model={topics}
        modelName="Topics"
        canUpdate={true}
        canDelete={true}
      />
      <ManageConatiner
        model={series}
        modelName="Series"
        canUpdate={true}
        canDelete={true}
      />
      <ManageConatiner
        model={thumbnails}
        modelName="Thumbnails"
        canUpdate={false}
        canDelete={true}
      />
      <ManageConatiner
        model={posts}
        modelName="Post"
        canUpdate={true}
        canDelete={true}
      />
    </div>
  );
};

// --------------------------------------------------------------------------

export type Item = Topic | Series | Thumbnail | Post;

interface Props {
  model: Array<Item> | undefined | null;
  modelName: string;
  canUpdate: boolean;
  canDelete: boolean;
}

const ManageConatiner: React.FC<Props> = ({
  model,
  modelName,
  canUpdate,
  canDelete,
}) => {
  if (!model) return;
  return (
    <>
      {model.length !== 0 ? (
        <div className="manage-table-container">
          <p className="manage-table-title">{modelName}</p>
          <div className="manage-table-header">
            {Object.keys(model[0]).map((key, idx) => {
              const propsKey = `${key}${idx}`;
              if (key.toLocaleLowerCase().includes("id") || key === "deletedAt")
                return <Fragment key={propsKey}></Fragment>;
              return <p key={propsKey}>{key}</p>;
            })}
            {canUpdate ? <p>update</p> : null}
            {canDelete ? <p>delete</p> : null}
          </div>
          {model.map((item, index) => (
            <div key={`manage-${index}`} className="manage-table">
              {Object.keys(item).map((key, idx) => {
                const propsKey = `${key}item${idx}`;
                if (
                  key.toLocaleLowerCase().includes("id") ||
                  key === "deletedAt"
                )
                  return <Fragment key={propsKey}></Fragment>;
                return (
                  <p key={propsKey}>
                    {item[key as keyof Item]?.toLocaleString()}
                  </p>
                );
              })}
              <UpdateAndDelete
                canUpdate={canUpdate}
                canDelete={canDelete}
                item={item}
                modelName={modelName}
              />
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default ManagePage;