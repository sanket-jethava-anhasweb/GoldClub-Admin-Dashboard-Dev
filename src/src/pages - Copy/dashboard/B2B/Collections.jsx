import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Divider,
  List,
  Tooltip,
  message,
  Switch,
  Popconfirm,
  FloatButton,
  Button,
  Modal,
  Checkbox,
  Skeleton,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { GET_COLLECTION_LIST } from "../../../GraphQl/Query";
import SectionTitle from "../../../components/Title/SectionTitle";
import DashboardTitle from "../../../components/Title/DashboardTitle";
import LoadMore from "../../../components/Buttons/LoadMore";
import InputComponent from "../../../components/Inputs/Input";
import { setCollections } from "../../../redux/actions/client";
import CustomModal from "../../../components/Inputs/CustomModal";
import {
  CREATE_COLLECTION,
  DELETE_COLLECTION,
  TOGGLE_COLLECTION_PUBLISH,
  UPDATE_COLLECTION,
} from "../../../GraphQl/Mutations";
import MultiImageUpload from "../../../components/Inputs/MutliImageUpload";
import Spinner from "../../../components/Spinner/Spinner";

const UpdateModal = (props) => {
  const [inputs, setInputs] = useState({
    id: props?.collection?.id,
    name: props?.collection?.name,
    publicationDate: props?.collection?.publicationDate,
    seo: props?.collection?.seo,
    isPublished: props?.collection?.isPublished,
    descriptionJson: props?.collection?.descriptionJson,
    backgroundImageAlt: props?.collection?.backgroundImageAlt,
    backgroundImage: props?.collection?.backgroundImage,
  });
  const [updateCollection, collection] = useMutation(UPDATE_COLLECTION, {
    variables: { id: props?.collection?.id, input: inputs },
    onCompleted: (data) => {
      props?.completed(collection);
    },
    onError: (err) => {
      props?.error(err);
    },
  });
  useEffect(() => {
    return () => {
      setInputs({
        name: props?.collection?.name,
        publicationDate: props?.collection?.publicationDate,
        seo: props?.collection?.seo,
        isPublished: props?.collection?.isPublished,
        descriptionJson: props?.collection?.descriptionJson,
        backgroundImageAlt: props?.collection?.backgroundImageAlt,
        backgroundImage: props?.collection?.backgroundImage,
      });
    };
  }, []);
  const handleOk = () => {
    updateCollection();
  };
  return (
    <Modal
      title='Update Collection'
      open={props?.open}
      onOk={handleOk}
      confirmLoading={collection?.loading}
      okButtonProps={{ style: { background: "green", color: "#fff" } }}
      okText='Update'
      onCancel={() => {
        setInputs({
          name: props?.collection?.name,
          publicationDate: props?.collection?.publicationDate,
          seo: props?.collection?.seo,
          isPublished: props?.collection?.isPublished,
          descriptionJson: props?.collection?.descriptionJson,
          backgroundImageAlt: props?.collection?.backgroundImageAlt,
          backgroundImage: props?.collection?.backgroundImage,
        });
        props?.setOpen(false);
      }}
    >
      <Divider />
      <div className='flex items-start justify-start my-3'>
        <InputComponent
          value={inputs?.name}
          placeholder='Enter Collection Title'
          allowClear='true'
          title='Collection Title'
          className='dark:bg-white'
          handleChange={(e) => {
            setInputs({ ...inputs, name: e.target.value });
          }}
        />
      </div>
      <div className='flex items-start justify-start my-3'>
        <Checkbox
          onChange={(e) =>
            setInputs({
              ...inputs,
              isPublished: e.target.checked,
            })
          }
          checked={inputs?.isPublished}
          id='taxes'
        />
        <label htmlFor='taxes' className='ml-2'>
          <p className='font-semibold'>Publish </p>
        </label>
      </div>
      {!inputs?.isPublished && (
        <div className='flex flex-col items-start justify-start my-3 pl-2'>
          <label htmlFor='taxes' className=''>
            <p className='font-semibold'>Publication Date </p>
          </label>
          <input
            type={
              inputs?.isPublished != "" ||
              inputs?.isPublished != undefined ||
              inputs?.isPublished != null
                ? "text"
                : "date"
            }
            value={inputs?.isPublished || ""}
            name='pubDate'
            id='pubDate'
            placeholder='Set Publication Date'
            className='bg-transparent dark:text-white dark:placeholder:text-white/50 focus:outline-none '
            onFocus={() => (document.getElementById("pubDate").type = "date")}
            onBlur={() =>
              (document.getElementById("pubDate").type =
                (inputs?.isPublished == "" ||
                  inputs?.isPublished == undefined ||
                  inputs?.isPublished == null) &&
                "text")
            }
            onChange={(e) =>
              setInputs({
                ...inputs,
                publicationDate: e.target.value,
              })
            }
          />
        </div>
      )}
      <div className='flex flex-col items-start justify-start my-3 pl-2'>
        <label htmlFor='taxes' className='mb-2'>
          <p className='font-semibold'>Collection Image </p>
        </label>
        <MultiImageUpload
          setImages={(e) => setInputs({ ...inputs, backgroundImage: e[0] })}
          // handleUpload={handleUpload}
          multiple={false}
          // id={params?.id}
        />
        Images must be of size x x y
      </div>
    </Modal>
  );
};
const CreateModal = (props) => {
  const [inputs, setInputs] = useState({
    name: props?.collection?.name,
    publicationDate: props?.collection?.publicationDate,
    seo: props?.collection?.seo,
    isPublished: props?.collection?.isPublished,
    descriptionJson: props?.collection?.descriptionJson,
    backgroundImageAlt: props?.collection?.backgroundImageAlt,
    backgroundImage: props?.collection?.backgroundImage,
  });
  const [createCollection, collection] = useMutation(CREATE_COLLECTION, {
    variables: { input: inputs },
    onCompleted: (data) => {
      props?.completed(collection);
    },
    onError: (err) => {
      props?.error(err);
    },
  });
  useEffect(() => {
    return () => {
      setInputs({
        name: props?.collection?.name,
        publicationDate: props?.collection?.publicationDate,
        seo: props?.collection?.seo,
        isPublished: props?.collection?.isPublished,
        descriptionJson: props?.collection?.descriptionJson,
        backgroundImageAlt: props?.collection?.backgroundImageAlt,
        backgroundImage: props?.collection?.backgroundImage,
      });
    };
  }, []);
  const handleOk = () => {
    createCollection();
  };
  return (
    <Modal
      title='Create New Collection'
      open={props?.open}
      onOk={handleOk}
      confirmLoading={collection?.loading}
      okButtonProps={{ style: { background: "green", color: "#fff" } }}
      okText='Create'
      onCancel={() => {
        setInputs({
          name: props?.collection?.name,
          publicationDate: props?.collection?.publicationDate,
          seo: props?.collection?.seo,
          isPublished: props?.collection?.isPublished,
          descriptionJson: props?.collection?.descriptionJson,
          backgroundImageAlt: props?.collection?.backgroundImageAlt,
          backgroundImage: props?.collection?.backgroundImage,
        });
        props?.setOpen(false);
      }}
    >
      <Divider />
      <div className='flex items-start justify-start my-3'>
        <InputComponent
          value={inputs?.name}
          placeholder='Enter Collection Title'
          allowClear='true'
          title='Collection Title'
          className='dark:bg-white'
          handleChange={(e) => {
            setInputs({ ...inputs, name: e.target.value });
          }}
        />
      </div>
      <div className='flex items-start justify-start my-3'>
        <Checkbox
          onChange={(e) =>
            setInputs({
              ...inputs,
              isPublished: e.target.checked,
            })
          }
          checked={inputs?.isPublished}
          id='taxes'
        />
        <label htmlFor='taxes' className='ml-2'>
          <p className='font-semibold'>Publish </p>
        </label>
      </div>
      {!inputs?.isPublished && (
        <div className='flex flex-col items-start justify-start my-3 pl-2'>
          <label htmlFor='taxes' className=''>
            <p className='font-semibold'>Publication Date </p>
          </label>
          <input
            type={
              inputs?.isPublished != "" ||
              inputs?.isPublished != undefined ||
              inputs?.isPublished != null
                ? "text"
                : "date"
            }
            value={inputs?.isPublished || ""}
            name='pubDate'
            id='pubDate'
            placeholder='Set Publication Date'
            className='bg-transparent dark:text-white dark:placeholder:text-white/50 focus:outline-none '
            onFocus={() => (document.getElementById("pubDate").type = "date")}
            onBlur={() =>
              (document.getElementById("pubDate").type =
                (inputs?.isPublished == "" ||
                  inputs?.isPublished == undefined ||
                  inputs?.isPublished == null) &&
                "text")
            }
            onChange={(e) =>
              setInputs({
                ...inputs,
                publicationDate: e.target.value,
              })
            }
          />
        </div>
      )}
      <div className='flex flex-col items-start justify-start my-3 pl-2'>
        <label htmlFor='taxes' className='mb-2'>
          <p className='font-semibold'>Collection Image </p>
        </label>
        <MultiImageUpload
          setImages={(e) => setInputs({ ...inputs, backgroundImage: e[0] })}
          // handleUpload={handleUpload}
          multiple={false}
          // id={params?.id}
        />
      </div>
    </Modal>
  );
};

const Collections = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const state = useSelector((state) => state?.client?.collections);
  const [localSearch, setLocalSearch] = useState([]);
  // const [localSearch, setLocalSearch] = useState([]);
  const [modalTitle, setModalTitle] = useState("Create New Collection");
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState({
    id: null,
    name: null,
    publicationDate: null,
    seo: { title: "", description: "" },
    isPublished: false,
    descriptionJson: null,
    backgroundImageAlt: "",
    backgroundImage: null,
  });
  const setTrial = (message) => {
    messageApi.open({
      type: "loading",
      content: message,
    });
  };
  const setSuccess = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };
  const setError = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };
  const dispatch = useDispatch();

  const [fetchCollections, collections] = useLazyQuery(GET_COLLECTION_LIST, {
    fetchPolicy: "cache-and-network",
    variables: {
      first: 20,
      after: null,
      filter: {},
      sort: { direction: "ASC", field: "NAME" },
    },
    onCompleted: (data) => {
      console.log(data);
      dispatch(setCollections(data?.collections?.edges));
      setLocalSearch(data?.collections?.edges);
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const [togglePublish, publishedCollection] = useMutation(
    TOGGLE_COLLECTION_PUBLISH,
    {
      onCompleted: (data) => {
        if (data?.errors?.length == 0 || data?.errors)
          setError("Unable to update collection");
        else {
          setSuccess("Updated collection successfully");
          fetchCollections();
        }
      },
      onError: (err) => {
        setError(err.message);
      },
    }
  );
  const [handleDelete, deletedCollection] = useMutation(DELETE_COLLECTION, {
    onCompleted: (data) => {
      setSuccess("Deleted collection successfully");
      fetchCollections();
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <section className='py-4 w-full'>
      {contextHolder}
      <CreateModal
        open={open}
        setOpen={(e) => setOpen(e)}
        title={modalTitle}
        edit={edit}
        collection={currentCollection}
        completed={(e) => {
          setSuccess("Created Collection successfully");
          setTimeout(() => {
            setOpen(false);
          }, 500);
        }}
        error={(e) => setError(e.message)}
      />
      {edit && (
        <UpdateModal
          open={edit}
          setOpen={(e) => setEdit(e)}
          title={"Update Collection"}
          collection={currentCollection}
          completed={(e) => {
            setSuccess("Updated Collection successfully");
            // dispatch(setCollections(e?.data.collections?.edges));
            console.log(e);
            setTimeout(() => {
              setEdit(false);
            }, 500);
          }}
          error={(e) => setError(e.message)}
        />
      )}
      <SectionTitle title='Collections' />
      <Divider className='dark:bg-white/10' />

      {/* <SearchComponent handleSearch={handleSearch} /> */}
      {/* {collections?.loading && <Spinner />} */}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 4,
        }}
        loading={collections?.loading}
        dataSource={localSearch}
        renderItem={(item) => (
          <List.Item>
            <Card
              type='inner'
              className='dark:bg-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm md:h-auto rounded-md border-1 border-black/20 dark:border-white w-full relative box-border'
              actions={[
                // <div className="flex items-center">
                <Tooltip
                  title='Publish/Unpublish Collection'
                  className='flex-3'
                >
                  <div className='flex items-center justify-start gap-2 px-3 w-full'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Publish:</span>
                    </h3>
                    <Switch
                      defaultChecked={JSON.parse(item?.node?.isPublished)}
                      loading={publishedCollection?.loading}
                      onChange={() =>
                        togglePublish({
                          variables: {
                            ids: [item?.node?.id],
                            isPublished: !item?.node?.isPublished,
                          },
                        })
                      }
                      className='bg-gray-500'
                    />
                  </div>
                </Tooltip>,
                <div className='flex items-center justify-between'>
                  <Tooltip title='Delete Collection' className='flex-1'>
                    <Popconfirm
                      title='Delete the task'
                      description='Are you sure to delete this task?'
                      onConfirm={() =>
                        handleDelete({
                          variables: { ids: [item?.node?.id] },
                        })
                      }
                      //   onCancel={cancel}
                      okButtonProps={{
                        style: { background: "rgb(220 38 38)" },
                      }}
                      okText={<span className='text-white'>Delete</span>}
                      cancelText='No'
                    >
                      <DeleteOutlined className='text-red-600 cursor-pointer text-md' />
                    </Popconfirm>
                  </Tooltip>
                  <Tooltip title='Update Collection' className='flex-1'>
                    <EditOutlined
                      className='text-blue-600 cursor-pointer text-md'
                      onClick={() => {
                        setEdit(true);
                        setCurrentCollection({
                          id: item?.node?.id,
                          name: item?.node.name,
                          publicationDate: item?.node.publicationDate,
                          seo: item?.node.seo,
                          isPublished: item?.node.isPublished,
                          descriptionJson: item?.node.descriptionJson,
                          backgroundImageAlt: item?.node.backgroundImageAlt,
                          backgroundImage: item?.node.backgroundImage,
                        });
                      }}
                    />
                  </Tooltip>
                </div>,
                // </div>,
              ]}
            >
              <Skeleton
                active
                loading={collections?.loading}
                paragraph={{
                  rows: 1,
                }}
                title={null}
              >
                <img
                  src={item?.node?.backgroundImage?.url}
                  alt={item?.node?.backgroundImage?.alt}
                  className='w-full h-auto'
                />
                <div className='font-semibold text-lg w-full'>
                  {item?.node?.name || "Unavailable"}
                </div>{" "}
              </Skeleton>
              <div class='flex items-start  '>
                <h5 className='text-sm w-full font-bold  dark:text-slate-400 pr-4'>
                  Products :
                </h5>
                <h5 className='text-sm w-full font-bold  dark:text-slate-400 pr-4'>
                  {item?.node?.products?.totalCount}
                </h5>
              </div>
            </Card>
          </List.Item>
        )}
      />

      {collections?.data?.collections?.pageInfo?.hasNextPage && (
        <LoadMore
          loading={collections?.loading}
          handleRefetch={() => {
            // setAfter({ ...after, searchAfter: search?.pageInfo?.endCursor });

            collections?.fetchMore({
              variables: {
                after: collections?.data?.collections?.pageInfo?.endCursor,
              },
              updateQuery: (prevResult, { fetchMoreResult }) => {
                fetchMoreResult.collections.edges = [
                  ...localSearch,
                  ...fetchMoreResult.collections.edges,
                ];
                return fetchMoreResult;
              },
            });
          }}
        />
      )}
      <FloatButton
        shape='circle'
        type='primary'
        onClick={() => {
          window.location.reload();
          // fetchCollections()
        }}
        style={{
          bottom: 94,
        }}
        icon={<ReloadOutlined />}
      />
      <FloatButton
        shape='circle'
        type='primary'
        onClick={() => {
          setEdit(false);
          setOpen(true);
        }}
        // style={{
        //   right: 94,
        // }}
        icon={<PlusOutlined />}
      />
    </section>
  );
};

export default Collections;
