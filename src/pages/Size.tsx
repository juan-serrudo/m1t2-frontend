import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { useState } from 'react'
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import gatewayClient from "../api/gatewayClient"
import { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
// para formulario
import { Dialog } from 'primereact/dialog';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const PREFIX_SERVICE = "v1/size"

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

export const serviceFetchremove = async (id: number): Promise<any> => {
  const response = await gatewayClient.delete(`${PREFIX_SERVICE}/${id}`,);
  return response.data;
};


const Size = () => {
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
    serviceFetchremove(itemIdSelect);
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
                      field.onChange(event.target.value.toUpperCase())
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
}

export default Size
