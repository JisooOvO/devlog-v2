import "@/style/manage.css";
import prisma from "@/lib/prisma";
import UpdateAndDelete from "../../lib/components/pages/manage/updateAndDelete";
import { Post, Series, Thumbnail, Topic, User } from "@prisma/client";
import { Fragment } from "react";

const ManagePage = async () => {
  const [user, topics, series, thumbnails, posts] = await prisma.$transaction([
    prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    }),
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
        model={user}
        modelName="Users"
        canUpdate={false}
        canDelete={false}
      />
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

export type Item = User | Topic | Series | Thumbnail | Post;

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
