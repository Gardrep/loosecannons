import { useState } from 'react';
import './ApiKeyValidator.css';
import getApiKeyInfo from '../../api_torn_service/get-api-key-info';
import useAPIKey from './api-key-store';

type ValidationStatusType = 'success' | 'error' | null;

interface StatusState {
  type: ValidationStatusType;
  message: string;
}

export const ApiKeyValidator = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const findInitalState = (): StatusState => {
    console.log("findInitalState=>")
    const API_KEY: string = useAPIKey.getState().getApiKey();

    if (!API_KEY) {
      return {
        type: null,
        message: '',
      }
    } else {
      return {
          type: 'success',
          message: 'API Key is valid!',
        }
    }
  }

  const [status, setStatus] = useState<StatusState>(findInitalState());

  const handleValidate = async (): Promise<void> => {
    if (!apiKey.trim()) {
      setStatus({
        type: 'error',
        message: 'Please enter an API key.',
      });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await getApiKeyInfo(apiKey);
      console.log("response.info", response.info)
      console.log("response.info.access.level > 2", response.info.access.level > 2)
      if (response.info && response.info.access.level > 2) {
        setStatus({
          type: 'success',
          message: 'API Key is valid!',
        });
        useAPIKey.getState().setApiKey(apiKey);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus({
          type: 'error',
          message: errorData.message || 'Invalid API Key.',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Unable to verify validty.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (): string => {
    let classes = 'api-key-input';
    if (status.type === 'success') classes += ' is-valid';
    if (status.type === 'error') classes += ' is-invalid';
    return classes;
  };

  const getStatusClassName = (): string => {
    let classes = 'status-message';
    if (status.type === 'success') classes += ' success';
    if (status.type === 'error') classes += ' error';
    return classes;
  };

  return (
    <div className="flex1 bg-slate-900 api-key-container px-8 pb-8">
      <label htmlFor="api-key-input" className="api-key-label">
        Validate API Key
      </label>

      <div className="api-key-input-group">
        <input
          id="api-key-input"
          type="password"
          value={apiKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          disabled={loading}
          className={getInputClassName()}
        />
        <button
          onClick={handleValidate}
          disabled={loading}
          className="api-key-button"
        >
          {loading ? 'Validating...' : 'Validate'}
        </button>
      </div>

      {status.message && (
        <p className={getStatusClassName()}>
          {status.message}
        </p>
      )}
    </div>
  );
};

export default ApiKeyValidator;