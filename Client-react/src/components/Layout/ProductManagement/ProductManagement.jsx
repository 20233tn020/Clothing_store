import React from 'react'
import styles from "./ProductManagement.module.css";
export default function ProductManagement() {
  return (
    <div>   
        <div className={styles.search_filters}>
            <div className={styles.search_box}>
                <input  type="text"     className={styles.form_control}     placeholder="Buscar productos..." />
                <i className="fas fa-search"></i>
            </div>
            <select className={`${styles.form_control} ${styles.filter_select}`}>
                <option value="">Todas las categorías</option>
                <option value="electronics">Electrónicos</option>
                <option value="clothing">Ropa</option>
                <option value="home">Hogar</option>
                <option value="sports">Deportes</option>
            </select>
            <select className={`${styles.form_control} ${styles.filter_select}`}>
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="outofstock">Sin stock</option>
            </select>
        </div>
        <div className={styles.product_grid}>
            <div className={styles.product_card}>

                <div  className={styles.product_image}>
                    <i class="fas fa-laptop fa-3x"></i>
                </div>
                <div  className={styles.product_info}>
                    <div  className={styles.product_name}>Laptop HP Pavilion</div>
                    <div  className={styles.product_category}>Electrónicos</div>
                    <div  className={styles.product_price}>$899.99</div>
                    <div  className={styles.product_stock}>
                        <span>Stock: 15</span>
                        <span class="badge badge-success stock-badge">En stock</span>
                    </div>
                    <div  className={styles.actions}>
                        <button className="btn btn-sm btn-info" onclick="viewProduct('PROD-001')"><i class="fas fa-eye"></i></button>
                        <button className="btn btn-sm btn-warning" onclick="showEditProductModal('PROD-001')"><i class="fas fa-edit"></i></button>
                        <button className="btn btn-sm btn-danger" onclick="confirmDeleteProduct('PROD-001')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
             <div  className={styles.product_card}>
                <div className={styles.product_image}>
                    <i className="fas fa-tablet-alt fa-3x"></i>
                </div>
                <div  className={styles.product_info}>
                            <div className={styles.product_name}>Tablet iPad</div>
                            <div className={styles.product_category}>Electrónicos</div>
                            <div className={styles.product_price}>$429.99</div>
                            <div className={styles.product_stock}>
                                <span>Stock: 0</span>
                                <span className="badge badge-danger stock-badge">Sin stock</span>
                            </div>
                            <div className={styles.actions}>
                                <button className="btn btn-sm btn-info" onclick="viewProduct('PROD-003')"><i className="fas fa-eye"></i></button>
                                <button className="btn btn-sm btn-warning" onclick="showEditProductModal('PROD-003')"><i className="fas fa-edit"></i></button>
                                <button className="btn btn-sm btn-danger" onclick="confirmDeleteProduct('PROD-003')"><i className="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
        </div>
        
    </div>
  )
}
