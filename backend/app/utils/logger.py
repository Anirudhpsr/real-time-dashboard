import logging

def setup_logger(name):
    logger = logging.getLogger(name)
    if not logger.hasHandlers():
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger

def log_error(message):
    logger = setup_logger('error_logger')
    logger.error(message)

def log_info(message):
    logger = setup_logger('info_logger')
    logger.info(message)