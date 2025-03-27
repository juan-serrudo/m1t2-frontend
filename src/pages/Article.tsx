import { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import gatewayClient from '../api/gatewayClient'
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
// para formulario
import { Dialog } from 'primereact/dialog';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const PREFIX_SERVICE = "v1/article"

// declaracion de servicios
const serviceFetchAll = async (): Promise<any> => {
  const response = await gatewayClient.get(`${PREFIX_SERVICE}`);
  return response.data;
};

export const serviceFetchCreate = async (data: any): Promise<any> => {
  const response = await gatewayClient.post(PREFIX_SERVICE, data);
  return response.data;
};

export const serviceFetchUpdate = async (id: number, updatedPost: any): Promise<any> => {
  const response = await gatewayClient.put(`${PREFIX_SERVICE}/${id}`, updatedPost);
  return response.data;
};

export const serviceFetchRemove = async (id: number): Promise<any> => {
  const response = await gatewayClient.delete(`${PREFIX_SERVICE}/${id}`,);
  return response.data;
};

const Article = () => {
  const endContent = () => {
      return <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={() => setform(true)} />
    }

    // usar states
    const [items, itemsSet] = useState([]);
    const [filters, filtersSet] = useState({
      page: 1,
      limit: 10,
      total: 0
    });
    const ColumnItems = [
      {
        header: "#",
        field: "index",
        width: "3rem",
        body: (_: any, options: any) => options.rowIndex + 1,
      },
      {
        header: "Nombre",
        field: "name",
        // width: "3rem",
        body: (data: any) => data.name,
      },
      {
        header: "Detalles",
        field: "detail",
        // width: "3rem",
        body: (data: any) => data.detail,
      },
      {
        header: "Acciones",
        field: "name",
        // width: "3rem",
        body: (data: any) => <>
          <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded onClick={() => openForm(data)} />
            <Button icon="pi pi-trash" severity='danger' rounded
              onClick={() => onOpenDialog(data.id)}
            />
          </div>
        </>,
      },
    ];
    // variables para formulario
    const [form, setform] = useState(false);
    // variables para form
    const validationSchema = yup.object().shape({
      id: yup.number().nullable(),
      name: yup.string().nullable(),
      detail: yup.string().nullable(),
      description: yup.string().nullable(),
      price: yup.string().nullable(),
      hasSize: yup.boolean().nullable(),
      typeArticleId: yup.number().nullable(),
    });

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(validationSchema),
    });

    const openForm = (data: any = null) => {
      if (data?.id) {
        reset({
          id: data?.id ?? null,
          name: data?.name ?? "",
          detail: data?.detail ?? "",
          description: data?.description ?? "",
          price: data?.price ?? "",
          hasSize: data?.hasSize ?? true,
          typeArticleId: data?.typeArticleId ?? 1,
        });
      } else {
      }
      setform(true);
    }

    // funcionalidad
    useEffect(() => {
      reset({
        id: null,
        name: "",
        detail: "",
        description: "",
        price: "",
        hasSize: false,
        typeArticleId: 4,
      });
      onLoadData();
    }, []);

    const onLoadData = () => {
      serviceFetchAll().then((response) => {
        itemsSet(response.response)
        filtersSet({
          page: 1,
          limit: 10, total: response.response.length
        })
      })
    }

    const onCloseForm = () => setform(false);

    const onSubmit = async (data: any) => {
      if (data?.id) await serviceFetchUpdate(data.id, data)
      else await serviceFetchCreate(data)
      onCloseForm()
      onLoadData()
    }
    // atributos para eliminar
    const [dialogDelete, setdialogDelete] = useState(false);
    const [itemIdSelect, setitemIdSelect] = useState(0);
    const onOpenDialog = (id: number) => {
      setitemIdSelect(id);
      setdialogDelete(true)
    };
    const onDelete = () => {
      serviceFetchRemove(itemIdSelect);
      setTimeout(
        () => {
          onLoadData();
          setdialogDelete(false)
        }
        , 100
      )
    }

    return (
      <>
        <div className="card">
          <br></br>
          <Toolbar className="mb-4" end={endContent}></Toolbar>

          {/* tabla */}
          <DataTable
            value={items}
            totalRecords={filters.total ?? 0}
            dataKey="id"
            first={(filters.page - 1) * filters.limit}
            paginator
            rows={filters.limit}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="{first} - {last} de {totalRecords} registros"
            emptyMessage="Lista Vacía"
            responsiveLayout="scroll"
            stripedRows
            rowHover={true}
            // onPage={(e) => onPage(e)}
            className="datatable-custom"
          >
            {ColumnItems.map((col, index) => (
              <Column
                key={index}
                header={col.header}
                field={col.field}
                body={col.body}
                headerStyle={{
                  width: col.width,
                }}
              />
            ))}
          </DataTable>

          <Dialog header="Tamaño" visible={form} style={{ width: '50vw' }} onHide={() => { if (!form) return; setform(false); }}>
            <form
              onSubmit={handleSubmit((data) => onSubmit(data))}
              noValidate
              className="p-fluid"
            >
              {/* Campo nombre*/}
              <div className="field">
                <label htmlFor="nombre">Nombre</label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="name"
                      {...field}
                      placeholder="Ingresa el nombre"
                      onChange={(event) =>
                        field.onChange(event.target.value)
                      }
                      className={classNames({ "p-invalid": errors.name })}
                    />
                  )}
                />

                <div>
                  {errors?.name ? (
                    <p style={{ color: "red" }}>{errors.name.message}</p>
                  ) : null}
                </div>
              </div>

              {/* Campo Detalles */}
              <div className="field">
                <label htmlFor="detail">Detalles</label>
                <Controller
                  name="detail"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="detail"
                      {...field}
                      placeholder="Ingresa el detalle"
                      onChange={(event) =>
                        field.onChange(event.target.value)
                      }
                      className={classNames({ "p-invalid": errors.detail })}
                    />
                  )}
                />

                <div>
                  {errors?.detail ? (
                    <p style={{ color: "red" }}>{errors.detail.message}</p>
                  ) : null}
                </div>
              </div>

              {/* Campo Descripción */}
              <div className="field">
                <label htmlFor="description">Descripción</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="description"
                      {...field}
                      placeholder="Ingresa el detalle"
                      onChange={(event) =>
                        field.onChange(event.target.value)
                      }
                      className={classNames({ "p-invalid": errors.description })}
                    />
                  )}
                />

                <div>
                  {errors?.description ? (
                    <p style={{ color: "red" }}>{errors.description.message}</p>
                  ) : null}
                </div>
              </div>



              {/* Campo Precio */}
              <div className="field">
                <label htmlFor="price">Precio</label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="price"
                      {...field}
                      placeholder="Ingresa el precio"
                      onChange={(event) =>
                        field.onChange(event.target.value)
                      }
                      className={classNames({ "p-invalid": errors.price })}
                    />
                  )}
                />

                <div>
                  {errors?.price ? (
                    <p style={{ color: "red" }}>{errors.price.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex w-full gap-2">
                <Button className="w-full" label='Guardar' type='submit' />
                <Button className="w-full" label='Cancelar' severity='secondary' onClick={onCloseForm} />
              </div>
            </form>
          </Dialog>

          <Dialog header="Eliminar" visible={dialogDelete} style={{ width: '50vw' }} onHide={() => { setdialogDelete(false); }}>
            <div className="flex">
              <h3>Desea eliminar?</h3>
            </div>
            <div className="flex w-full gap-2">
              <Button className="w-full" label='Si' onClick={onDelete} />
              <Button className="w-full" label='No' severity='secondary' onClick={() => setdialogDelete(false)} />
            </div>

          </Dialog>

        </div>
      </>
    )
};

export default Article;
