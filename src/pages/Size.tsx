import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'

const Size = () => {

  const endContent = () => {
    return <Button label="Nuevo" icon="pi pi-plus" severity="success" />
  }

  return (
    <>
      <div className="card">
        <Toolbar className="mb-4" end={endContent}></Toolbar>
      </div>
    </>
  )
}

export default Size
