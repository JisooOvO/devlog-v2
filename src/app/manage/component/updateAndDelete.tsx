"use client";

import IconButton from "@/lib/components/iconButton";
import DeleteIcon from "@/lib/icons/delete";
import "@/style/manage.css";
import { Item } from "../page";
import EditIcon from "@/lib/icons/edit";
import CustomModal from "@/lib/components/customModal";
import { Dispatch, Fragment, SetStateAction, useState } from "react";

const size = "1.5rem";

interface Props {
  canUpdate: boolean;
  canDelete: boolean;
  item: Item;
  modelName: string;
}

const UpdateAndDelete: React.FC<Props> = ({
  canUpdate,
  canDelete,
  item,
  modelName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <>
        {canUpdate ? (
          <IconButton
            description="수정하기"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <EditIcon width={size} height={size} />
          </IconButton>
        ) : null}
        {canDelete ? (
          <IconButton
            description="삭제하기"
            onClick={() => {
              const lowerModelName = modelName.toLocaleLowerCase();
              if (confirm("정말로 삭제하시겠습니까?")) {
                const fetchData = async () => {
                  const response = await fetch(`/api/${lowerModelName}`, {
                    method: "DELETE",
                    body: JSON.stringify({
                      [lowerModelName]: { ...item },
                    }),
                  });

                  const jsonData = await response.json();

                  alert(jsonData["message"]);

                  switch (response.status) {
                    case 200:
                      window.location.reload();
                      break;
                  }
                };

                fetchData();
              }
            }}
          >
            <DeleteIcon width={size} height={size} />
          </IconButton>
        ) : null}
      </>
      <CustomModal isOpen={isOpen}>
        <UpdateModal item={item} modelName={modelName} setIsOpen={setIsOpen} />
      </CustomModal>
    </>
  );
};

// --------------------------------------------------------------------------

interface UpdateModalProps {
  item: Item;
  modelName: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  item,
  modelName,
  setIsOpen,
}) => {
  const [target, setTarget] = useState<Item>(item);

  return (
    <div>
      <h2>{modelName} 수정</h2>
      <div className="update-container">
        {Object.keys(item).map((key, idx) => {
          const propsKey = `${key}${idx}`;
          if (key.toLocaleLowerCase().includes("id") || key.includes("At"))
            return <Fragment key={propsKey}></Fragment>;
          return (
            <div key={propsKey}>
              <p className="update-key">{key}</p>
              <textarea
                className="update-input"
                value={target[key as keyof Item]?.toString()}
                onChange={(event) => {
                  if (typeof item[key as keyof Item] === "string") {
                    setTarget((prev) => {
                      const updatedValue = event.target.value;
                      return {
                        ...prev,
                        [key]:
                          typeof prev[key as keyof Item] === "string"
                            ? updatedValue
                            : prev[key as keyof Item],
                      };
                    });
                  }
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="update-button-container">
        <button
          className="custom-button"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          취소
        </button>{" "}
        <button
          className="custom-button"
          onClick={() => {
            const lowerModelName = modelName.toLocaleLowerCase();
            const fetchData = async () => {
              const response = await fetch(`/api/${lowerModelName}`, {
                method: "PUT",
                body: JSON.stringify({
                  [lowerModelName]: { ...target },
                }),
              });

              const jsonData = await response.json();

              alert(jsonData["message"]);

              switch (response.status) {
                case 200:
                  window.location.reload();
                  break;
              }
            };

            fetchData();
          }}
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default UpdateAndDelete;
