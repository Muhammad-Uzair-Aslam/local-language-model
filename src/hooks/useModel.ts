import { useState, useEffect } from 'react';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { initLlama, LlamaContext } from 'llama.rn';
import { Alert } from 'react-native';

const modelUrl =
  'https://huggingface.co/talhabytheway/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M-GGUF/resolve/main/deepseek-r1-distill-qwen-1.5b-q4_k_m.gguf?download=true';

const modelPath = `${RNFS.DocumentDirectoryPath}/deepseek-r1-distill-qwen-1.5b-q4_k_m.gguf`;

interface ModelState {
  isDownloaded: boolean;
  isModelLoaded: boolean;
  progress: number;
  model: LlamaContext | null;
}

const getContentLength = async (url: string): Promise<number> => {
  const response = await fetch(url, { method: 'HEAD' });
  if (!response.ok) {
    throw new Error(`HEAD request failed with status ${response.status}`);
  }
  const contentLength = response.headers.get('Content-Length');
  if (!contentLength) {
    throw new Error('Content-Length header missing');
  }
  return parseInt(contentLength, 10);
};

export const useModel = () => {
  const [state, setState] = useState<ModelState>({
    isDownloaded: false,
    isModelLoaded: false,
    progress: 0,
    model: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadLlamaModel = async (_modelPath: string): Promise<LlamaContext> => {
      try {
        const context = await initLlama({
          model: _modelPath,
          use_mlock: true,
          n_ctx: 2048,
          n_gpu_layers: 1,
        });
        return context;
      } catch (error) {
        console.error('Error in loadLlamaModel:', error);
        throw error;
      }
    };

    const downloadModel = async () => {
      try {
        let fileExists = await RNFS.exists(modelPath);
        if (fileExists) {
          try {
            const remoteContentLength = await getContentLength(modelUrl);
            const localFileInfo = await RNFS.stat(modelPath);
            if (localFileInfo.size === remoteContentLength) {
              if (mounted) setState(prev => ({ ...prev, isDownloaded: true }));
              return;
            } else {
              await RNFS.unlink(modelPath);
              fileExists = false;
            }
          } catch (error) {
            console.error('Error verifying file:', error);
            await RNFS.unlink(modelPath);
            fileExists = false;
          }
        }

        if (!fileExists) {
          const downloadTask = RNFS.downloadFile({
            fromUrl: modelUrl,
            toFile: modelPath,
            progress: res => {
              const percentage = (res.bytesWritten / res.contentLength) * 100;
              if (mounted) setState(prev => ({ ...prev, progress: percentage }));
            },
          });

          const downloadResult = await downloadTask.promise;
          if (downloadResult.statusCode === 200) {
            if (mounted) {
              setState(prev => ({ ...prev, isDownloaded: true }));
            }
          } else {
            throw new Error(`Download failed with status code ${downloadResult.statusCode}`);
          }
        }
      } catch (error) {
        console.error('Download error:', error);
        Alert.alert('Error', 'Failed to download model');
        if (mounted) {
          setState(prev => ({ ...prev, isDownloaded: false }));
        }
      }
    };

    const loadModel = async () => {
      try {
        const exists = await RNFS.exists(modelPath);
        if (!exists) {
          setState(prev => ({ ...prev, isDownloaded: false }));
          return;
        }

        const llamaModel = await loadLlamaModel(modelPath);
        if (mounted) {
          setState(prev => ({
            ...prev,
            model: llamaModel,
            isModelLoaded: true,
          }));
        }
      } catch (error) {
        console.error('Error loading model:', error);
        // Delete corrupted file and reset state
        await RNFS.unlink(modelPath);
        if (mounted) {
          setState(prev => ({
            ...prev,
            isDownloaded: false,
            isModelLoaded: false,
          }));
        }
        Alert.alert('Error', 'Failed to load model. The file will be re-downloaded.');
      }
    };

    if (!state.isDownloaded) {
      downloadModel();
    } else if (!state.isModelLoaded) {
      loadModel();
    }

    return () => {
      mounted = false;
    };
  }, [state.isDownloaded]);

  return state;
};