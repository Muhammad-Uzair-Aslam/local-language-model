import { useState, useEffect } from 'react';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { initLlama, LlamaContext } from 'llama.rn';
import { Alert } from 'react-native';

const modelUrl = 'https://huggingface.co/talhabytheway/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M-GGUF/resolve/main/deepseek-r1-distill-qwen-1.5b-q4_k_m.gguf?download=true';
const modelPath = `${RNFS.DocumentDirectoryPath}/deepseek-r1-distill-qwen-1.5b-q4_k_m.gguf`;

interface ModelState {
  isDownloaded: boolean;
  isModelLoaded: boolean;
  progress: number;
  model: LlamaContext | null;
}

export const useModel = () => {
  const [state, setState] = useState<ModelState>({
    isDownloaded: false,
    isModelLoaded: false,
    progress: 0,
    model: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadLlamaModel = async ({ _modelPath }: { _modelPath: string }): Promise<LlamaContext> => {
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
        const fileExists = await RNFS.exists(modelPath);
        if (!fileExists) {
          await RNFS.downloadFile({
            fromUrl: modelUrl,
            toFile: modelPath,
            progress: res => {
              const P = (res.bytesWritten / res.contentLength) * 100;
              if (mounted) setState(prev => ({ ...prev, progress: P }));
            },
          }).promise;
        }
        if (mounted) setState(prev => ({ ...prev, isDownloaded: true }));
      } catch (error) {
        console.error('Download error:', error);
        Alert.alert('Error', 'Failed to download model');
      }
    };

    const loadModel = async () => {
      try {
        const exists = await RNFS.exists(modelPath);
        if (!exists) return;
        
        const llamaModel = await loadLlamaModel({ _modelPath: modelPath });
        if (mounted) {
          setState(prev => ({
            ...prev,
            model: llamaModel,
            isModelLoaded: true,
          }));
        }
      } catch (error) {
        console.error('Error loading model:', error);
        Alert.alert('Error', 'Failed to load model');
      }
    };

    if (!state.isDownloaded) {
      downloadModel();
    } 
    else loadModel();
    
    return () => {
      mounted = false;
    };
  }, [state.isDownloaded]);

  return state;
};