
import { Routes, Route, useNavigate} from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import { MenuItem } from 'primereact/menuitem';
import Home from './pages/Home'
import Article from './pages/Article'
import TypeArticle from './pages/TypeArticle'
import Size from './pages/Size'
import User from './pages/User'
import Footer from './components/Footer'

const App = () => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Catálogo',
      icon: 'pi pi-align-justify',
      items: [
        {
          label: 'Articulos',
          icon: 'pi pi-car',
          command: () => navigate('/article')
        },
        {
          label: 'Tipo de articulos',
          icon: 'pi pi-cart-arrow-down',
          command: () => navigate('/typearticle')
        },
        {
          label: 'Tallas',
          icon: 'pi pi-thumbtack',
          command: () => navigate('/size')
        }
      ]
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      command: () => navigate('/user')
    }
  ];

  return (
    <div className="App">
      <header>
        <Menubar
          model={menuItems}
        />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article" element={<Article />} />
          <Route path="/typearticle" element={<TypeArticle />} />
          <Route path="/size" element={<Size />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App
