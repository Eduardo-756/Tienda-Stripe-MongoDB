import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const urlSearch = new URLSearchParams(location.search)
  const urlCategoryListinArray = urlSearch.getAll("category")

  const urlCategoryListObject = {}
  urlCategoryListinArray.forEach(el => {
    urlCategoryListObject[el] = true
  })

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject)
  const [filterCategoryList, setFilterCategoryList] = useState([])

  const [sortBy, setSortBy] = useState("")

  const fetchData = async () => {
    setLoading(true) // Set loading to true before fetching data
    const response = await fetch(SummaryApi.filterProduct.url, {
      method: SummaryApi.filterProduct.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        category: filterCategoryList
      })
    })

    const dataResponse = await response.json()
    setData(dataResponse?.data || [])
    setLoading(false) // Set loading to false after fetching data
  }

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target

    if (value === 'all') {
      // Handle "Todos" checkbox
      if (checked) {
        // Select all categories
        const newSelectCategory = {};
        productCategory.forEach(cat => {
          newSelectCategory[cat.value] = true;
        });
        setSelectCategory(newSelectCategory);
      } else {
        // Deselect all categories
        setSelectCategory({});
      }
    } else {
      // Handle individual category checkboxes
      setSelectCategory(prev => {
        const newSelectCategory = { ...prev, [value]: checked };
        
        // Update "Todos" checkbox based on individual category selections
        const allSelected = productCategory.every(cat => newSelectCategory[cat.value] || false);
        const noneSelected = productCategory.every(cat => !newSelectCategory[cat.value]);
        
        return {
          ...newSelectCategory,
          all: allSelected,
          none: noneSelected
        };
      });
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterCategoryList])

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory).filter(categoryKeyName => selectCategory[categoryKeyName]);

    setFilterCategoryList(arrayOfCategory)

    // Format for URL change when change on the checkbox
    const urlFormat = arrayOfCategory.map(el => `category=${el}`).join("&&");

    navigate("/product-category?" + urlFormat)
  }, [selectCategory])

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target

    setSortBy(value)

    if (value === 'asc') {
      setData(prev => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice))
    } else if (value === 'dsc') {
      setData(prev => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice))
    }
  }

  return (
    <div className='container mx-auto p-4'>

      {/***desktop version */}
      <div className='hidden lg:grid grid-cols-[200px,1fr]'>
        {/***left side */}
        <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
          {/**sort by */}
          <div className=''>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Ordenar de</h3>

            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3'>
                <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"} />
                <label>Precio - Menor a mayor</label>
              </div>

              <div className='flex items-center gap-3'>
                <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"} />
                <label>Precio - Mayor a menor</label>
              </div>
            </form>
          </div>

          {/**filter by */}
          <div className=''>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Categorías</h3>

            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  name={"category"}
                  value='all'
                  checked={Object.keys(selectCategory).length === productCategory.length}
                  onChange={handleSelectCategory}
                  id='all'
                />
                <label htmlFor='all'>Marcar/Desmarcar todos</label>
              </div>
              {productCategory.map((category, index) => (
                <div className='flex items-center gap-3' key={index}>
                  <input
                    type='checkbox'
                    name={"category"}
                    value={category.value}
                    checked={selectCategory[category.value] || false}
                    onChange={handleSelectCategory}
                    id={category.value}
                  />
                  <label htmlFor={category.value}>{category.label}</label>
                </div>
              ))}
            </form>
          </div>
        </div>

        {/***right side (product) */}
        <div className='px-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>Resultados de la búsqueda: {data.length}</p>

          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
            {data.length !== 0 && !loading && (
              <VerticalCard data={data} loading={loading} />
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default CategoryProduct