pushd K:\Development\Ethereum\make-chainids
pushd .\ethereum-lists-chains
git pull
popd
& 'C:\Program Files\nodejs\node.exe' -r ts-node/register .\make-chainId.ts
popd
