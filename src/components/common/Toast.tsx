import type { ToastData } from '@/hooks/useToast';
import { Icon } from './Icon';
import styles from './Toast.module.css';

export function Toast({ toast }: { toast: ToastData }) {
  return (
    <div key={toast.id} className={styles.toast} role="status">
      <Icon name="checkCircle" size={20} />
      <p className={styles.message}>{toast.message}</p>
      {toast.action && (
        <button type="button" className={styles.action} onClick={toast.action.onClick}>
          {toast.action.label}
        </button>
      )}
    </div>
  );
}
