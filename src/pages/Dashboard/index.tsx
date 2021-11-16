import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface FoodProps {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

interface AddFoodProps {
  image:string;
  name:string;
  price:string;
  description:string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFood, setEditingFood] = useState<FoodProps>()
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function handleGetFood() {
      const { data } = await api.get('/foods');

      setFoods(data);
    }

    handleGetFood()
  }, [])

  async function handleAddFood(food: AddFoodProps) {
    try {
      const { data } = await api.post<FoodProps>('/foods', {
        ...food,
        available: true
      })

      setFoods([...foods, data])
    } catch (error) {
      console.log(error)
    }
  }

  async function handleUpdateFood(food: AddFoodProps) {
    try {
      const { data: foodUpdated } = await api.put<FoodProps>(`/food/${editingFood?.id}`, {
        ...editingFood, ...food
      })

      const updatedFoods = foods.map((food) => food.id !== foodUpdated.id ? food : foodUpdated);

      setFoods(updatedFoods);
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDeleteFood(foodId: number) {
    await api.delete(`/foods/${foodId}`);

    const filteredFoods = foods.filter((food) => food.id !== foodId)

    setFoods(filteredFoods);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodProps) {
    setEditingFood(food)
    setEditModalOpen(true)
  }




  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
