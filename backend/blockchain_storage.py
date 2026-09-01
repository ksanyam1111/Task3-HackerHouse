import hashlib
import time
import logging
import os
import algokit_utils
from artifact import (UseGlobalStorageArgs,HelloWorldFactory)
from dotenv import load_dotenv

load_dotenv()


def verify_data_on_chain(data: dict) -> dict:
    """
    Mock function to simulate verifying data on a blockchain.
    The user can replace this with actual Web3 logic later.
    """
    # 1. Create a hash of the discovered data to represent the "fingerprint"
    data_string = f"{data.get('post_url')}_{data.get('post_title')}"
    data_hash = hashlib.sha256(data_string.encode('utf-8')).hexdigest()
    
    algorand = algokit_utils.AlgorandClient.testnet()
    deployer_ = algorand.account.from_mnemonic(mnemonic=os.environ['MNEMONIC'])

    factory = algorand.client.get_typed_app_factory(
        HelloWorldFactory, default_sender=deployer_.address
    )

    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    if result.operation_performed in [
        algokit_utils.OperationPerformed.Create,
        algokit_utils.OperationPerformed.Replace,
    ]:
        algorand.send.payment(
            algokit_utils.PaymentParams(
                amount=algokit_utils.AlgoAmount(algo=1),
                sender=deployer_.address,
                receiver=app_client.app_address,
            )
        )

    response = app_client.send.hello(args=UseGlobalStorageArgs(val1=data_hash))
    
    # 2. Return the mock blockchain record
    return {
        "success": True,
        "hash": data_hash,
        "tx_id": str(response.tx_id),
        "network": "testnet",
        "message": "Data successfully verified on the mock blockchain."
    }
