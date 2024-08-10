import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      <HorizontalCardProduct category={"auriculares"} heading={"Mejores Auriculares"} />
      <HorizontalCardProduct category={"relojes"} heading={"Relojes Populares"} />

      <VerticalCardProduct category={"moviles"} heading={"Móviles"} />
      <VerticalCardProduct category={"ratones"} heading={"ratones"} />
      <VerticalCardProduct category={"televisores"} heading={"Televisores"} />
      <VerticalCardProduct category={"camaras"} heading={"Cámaras y Fotografía"} />
      <VerticalCardProduct category={"cascos"} heading={"Cascos con Cable"} />
      <VerticalCardProduct category={"altavoces"} heading={"Altavoces Bluetooth"} />
      <VerticalCardProduct category={"refrigeradores"} heading={"Refrigeradores"} />
      <VerticalCardProduct category={"afeitadoras"} heading={"Afeitadoras"} />
    </div>
  )
}

export default Home