import styles from "./TrashModal.module.css";
import { Server } from "../models.ts";
import { useServers } from "./ServersProvider.tsx";

interface Props {
    server: Server | undefined;
    onClose: () => void;
}

export function TrashModal(props: Props) {
    const { server, onClose } = props;
    const { removeServer } = useServers();

     return (
         <section className={styles.deleteSection}
              onClick={(e) => {
                  if (e.target === e.currentTarget) {
                      e.stopPropagation();
                      onClose();
                  }
              }}
         >
             <div className={styles.abstract}>
                <h1>Le Cercle</h1>
                <p>Are you sure you want to delete this server ?</p>
             </div>
             <div className={styles.card}>
                 <h2>Delete : {server?.name} ?</h2>
                 <div className={styles.btnBox}>
                     <button
                         className={`${styles.btn} ${styles.btnDelete}`}
                         onClick={() => {
                             onClose();
                             removeServer(server?.id ?? "");
                         }}
                     >
                         Sure
                     </button>
                     <button
                         className={`${styles.btn} ${styles.btnCancel}`}
                         onClick={() => {
                             onClose();
                         }}
                     >
                         Cancel
                     </button>
                 </div>
             </div>
         </section>
     )
}