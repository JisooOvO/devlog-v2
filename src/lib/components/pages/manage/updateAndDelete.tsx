"use client";

import IconButton from "@/lib/components/iconButton";
import DeleteIcon from "@/lib/icons/delete";
import EditIcon from "@/lib/icons/edit";
import CustomModal from "@/lib/components/customModal";
import useFetchData from "@/lib/hooks/useFetchData";
import { Item } from "../../../../app/admin/manage/page";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import "@/style/manage.css";

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
  const lowerModelName = modelName.toLocaleLowerCase();
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: deletedItemKey,
    isLoading,
    fetchData,
  } = useFetchData(`/api/admin/${lowerModelName}`, "", false);

  useEffect(() => {
    if (deletedItemKey) {
      window.location.reload();
    }
  }, [deletedItemKey]);

  return (
    <>
      <>
        {canUpdate && (
          <IconButton
            description="수정하기"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <EditIcon width={size} height={size} />
          </IconButton>
        )}
        {canDelete && (
          <IconButton
            description="삭제하기"
            onClick={() => {
              if (confirm("정말로 삭제하시겠습니까?") && !isLoading) {
                fetchData({
                  method: "DELETE",
                  body: JSON.stringify({
                    [lowerModelName]: { ...item },
                  }),
                });
              }
            }}
          >
            <DeleteIcon width={size} height={size} />
          </IconButton>
        )}
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
  const lowerModelName = modelName.toLocaleLowerCase();
  const { data, isLoading, fetchData } = useFetchData(
    `/api/admin/${lowerModelName}`,
    "",
    false
  );

  useEffect(() => {
    if (data) {
      setIsOpen(false);
      window.location.reload();
    }
  }, [data, setIsOpen]);

  return (
    <div>
      <h2>{modelName} 수정</h2>
      <div className="update-container">
        {Object.keys(item).map((key, idx) => {
          const propsKey = `${key}${idx}`;
          if (key.toLocaleLowerCase().includes("id") || key.includes("At")) {
            return <Fragment key={propsKey}></Fragment>;
          }
          return (
            <div key={propsKey}>
              <p className="update-key">{key}</p>
              <textarea
                spellCheck={false}
                className="update-input"
                value={target[key as keyof Item]?.toString()}
                onChange={(event) => {
                  setTarget((prev) => {
                    const updatedValue = event.target.value;
                    return {
                      ...prev,
                      [key]: updatedValue,
                    };
                  });
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
            if (!isLoading) {
              fetchData({
                method: "PUT",
                body: JSON.stringify({
                  [lowerModelName]: { ...target },
                }),
              });
            }
          }}
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default UpdateAndDelete;
