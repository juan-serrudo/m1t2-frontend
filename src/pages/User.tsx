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

const PREFIX_SERVICE = "v1/user"

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
  const response = await gatewayClient.patch(`${PREFIX_SERVICE}/${id}`, updatedPost);
  return response.data;
};

export const serviceFetchRemove = async (id: number): Promise<any> => {
  const response = await gatewayClient.delete(`${PREFIX_SERVICE}/${id}`,);
  return response.data;
};

const User = () => {
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
        field: "user",
        // width: "3rem",
        body: (data: any) => data.user,
      },
      {
        header: "Rol",
        field: "role",
        // width: "3rem",
        body: (data: any) => data.role,
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
      user: yup.string().nullable(),
      password: yup.string().nullable(),
      role: yup.string().nullable(),
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
          user: data?.user ?? "",
          password: "",
          role: data?.role ?? "",
        });
      } else {
      }
      setform(true);
    }

    // funcionalidad
    useEffect(() => {
      reset({
        id: null,
        user: "",
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

          <Dialog header="Usuario" visible={form} style={{ width: '50vw' }} onHide={() => { if (!form) return; setform(false); }}>
            <form
              onSubmit={handleSubmit((data) => onSubmit(data))}
              noValidate
              className="p-fluid"
            >
              {/* Campo usuario*/}
              <div className="field">
                <label htmlFor="nombre">Usuario</label>
                <Controller
                  name="user"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="user"
                      {...field}
                      placeholder="Ingrese usuario"
                      onChange={(event) =>
                        field.onChange(event.target.value)
                      }
                      className={classNames({ "p-invalid": errors.user })}
                    />
                  )}
                />

                <div>
                  {errors?.user ? (
                    <p style={{ color: "red" }}>{errors.user.message}</p>
                  ) : null}
                </div>
              </div>

              {/* Campo contraseña*/}
              <div className="field">
                <label htmlFor="password">Contraseña</label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="password"
                      type="password"
                      {...field}
                      placeholder="Ingrese contraseña"
                      onChange={(event) =>
                        field.onChange(event.target.value)
                      }
                      className={classNames({ "p-invalid": errors.password })}
                    />
                  )}
                />

                <div>
                  {errors?.password ? (
                    <p style={{ color: "red" }}>{errors.password.message}</p>
                  ) : null}
                </div>
              </div>

              {/* Campo rol*/}
              <div className="field">
                <label htmlFor="role">Rol</label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="role"
                      {...field}
                      placeholder="Ingrese rol"
                      onChange={(event) =>
                        field.onChange(event.target.value)
                      }
                      className={classNames({ "p-invalid": errors.role })}
                    />
                  )}
                />

                <div>
                  {errors?.role ? (
                    <p style={{ color: "red" }}>{errors.role.message}</p>
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

export default User;
