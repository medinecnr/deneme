"use client";
import React, { useState } from 'react';
import { Button } from "@nextui-org/button";
import { EditIcon } from "./Icons/EditIcon";
import { DeleteIcon } from "./Icons/DeleteIcon";
import { PlusIcon } from "./Icons/PlusIcon";
import "./globals.css";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

type Product = {
  id: number;
  name: string;
  productcode: number;
  date: string;
  image: string;
};

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Ürün 1",
    productcode: 12345,
    date: "16.04.2024",
    image: "https://picsum.photos/id/228/200/300",
  },
  {
    id: 1,
    name: "Ürün 2",
    productcode: 43534,
    date: "29.07.2024",
    image: "https://picsum.photos/id/238/200/300",
  },
  {
    id: 1,
    name: "Ürün 3",
    productcode: 76876,
    date: "10.10.2024",
    image: "https://picsum.photos/id/248/200/300",
  },
];

export default function Urunler() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Yeni ürün form state'leri
  const [newProductName, setNewProductName] = useState("");
  const [newProductCode, setNewProductCode] = useState("");
  const [newProductImage, setNewProductImage] = useState<string | null>(null);
  const [newProductDate, setNewProductDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddProduct = () => {
    if (!newProductName || !newProductCode || !newProductImage || !newProductDate) {
      setError("Lütfen tüm alanları doldurun ve resim seçin.");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: newProductName,
      productcode: parseInt(newProductCode),
      date: newProductDate,
      image: newProductImage,
    };
    setProducts([...products, newProduct]);

    
    onOpenChange();
    setNewProductName("");
    setNewProductCode("");
    setNewProductImage(null);
    setNewProductDate("");
    setError(null);
  };

 
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProduct = () => {
    if (selectedProduct) {
      setProducts(products.map(product =>
        product.id === selectedProduct.id ? selectedProduct : product
      ));
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(product => product.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="w-full max-w-full p-2">
      <div className="mb-4 flex justify-end">
        <Button onPress={onOpen}>
          Yeni Ürün Ekle
          <PlusIcon width={24} height={24} />
        </Button>
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-white">
        <table className="w-full table-auto border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border p-2 text-center">Ürünler</th>
              <th className="border p-2 text-center">Ürün Adı</th>
              <th className="border p-2 text-center">Ürün Kodu</th>
              <th className="border p-2 text-center">Eklenme Tarihi</th>
              <th className="border p-2 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="border py-2">
                  <div className="flex justify-center items-center">
                    <img src={product.image} alt={product.name} className="imgurun rounded-md" />
                  </div>
                </td>
                <td className="border">{product.name}</td>
                <td className="border">{product.productcode}</td>
                <td className="border">{product.date}</td>
                <td className="border">
                  <Button onPress={() => {
                    setSelectedProduct(product);
                    setIsEditModalOpen(true);
                  }}>
                    <EditIcon /> Düzenle
                  </Button>
                  <Button color="danger" className="ml-2" onPress={() => {
                    setSelectedProduct(product);
                    setIsDeleteModalOpen(true);
                  }}>
                    <DeleteIcon /> Sil
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Yeni Ürün Ekle</ModalHeader>
              <ModalBody>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Ürün Adı"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="input p-2 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Ürün Kodu"
                    value={newProductCode}
                    onChange={(e) => setNewProductCode(e.target.value.replace(/[^0-9]/g, ''))} // Harfleri engelle
                    className="input p-2 rounded-md"
                  />
                  <input
                    type="date"
                    value={newProductDate}
                    onChange={(e) => setNewProductDate(e.target.value)}
                    className="input p-2 rounded-md"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="input p-2 rounded-md"
                  />
                  {newProductImage && (
                    <img src={newProductImage} alt="Ürün Resmi" className="mt-4 rounded-md" />
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Kapat
                </Button>
                <Button color="success" onPress={handleAddProduct}>
                  KAYDET
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Ürünü Düzenle</ModalHeader>
              <ModalBody>
                {selectedProduct && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={selectedProduct.name}
                      onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, name: e.target.value })
                      }
                      className="input p-2 rounded-md"
                    />
                    <input
                      type="text"
                      value={selectedProduct.productcode.toString()}
                      onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, productcode: parseInt(e.target.value.replace(/[^0-9]/g, '')) }) 
                      }
                      className="input p-2 rounded-md"
                    />
                    <input
                      type="text"
                      value={selectedProduct.image}
                      onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, image: e.target.value })
                      }
                      className="input p-2 rounded-md"
                    />                    <input
                    type="date"
                    value={selectedProduct.date}
                    onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, date: e.target.value })
                    }
                    className="input p-2 rounded-md"
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Kapat
              </Button>
              <Button color="success" onPress={handleEditProduct}>
                Güncelle
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>

    <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Ürünü Sil</ModalHeader>
            <ModalBody>
              <p>Bu ürünü silmek istediğinizden emin misiniz?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Kapat
              </Button>
              <Button color="danger" onPress={handleDeleteProduct}>
                Sil
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  </div>
);
}